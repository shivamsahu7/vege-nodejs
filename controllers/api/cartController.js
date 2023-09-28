const db = require('@models');
const {  Cart, cartSubProduct, Coupon, CouponDetail } = require('@models');

addCart = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { subProductId, quantity } = req.body;
        const userId = req.user.id;
        const cartSubProductData = {};

        let cart = await Cart.findOne({
            userId: userId
        })

        if (!cart) {
            cart = await Cart.create({
                userId: userId,
                amount: 0,
                totalAmount: 0
            }, { transaction: t })
        }

        const findCartSubProduct = await cartSubProduct.findOne({
            where: {
                userId: userId,
                cartId: cart.id,
                subProduct: subProductId
            }
        })

        if (findCartSubProduct) {
            findCartSubProduct.quantity = quantity
            await findCartSubProduct.save({ transaction: t });
        } else {
            const createCartSubProduct = await cartSubProduct.create({
                userId: userId,
                cartId: cart.id,
                subProduct: subProductId,
                quantity: quantity
            }, { transaction: t });
        }

        let query = "SELECT SUM(subproducts.price * cartsubproducts.quantity) as cartTotalAmount FROM cartsubproducts INNER JOIN subproducts ON cartsubproducts.subProduct = subproducts.id WHERE  cartsubproducts.cartId = :cartId limit 1 ;"

        const getCartSubProduct = await db.sequelize.query(query, {
            replacements: {
                cartId: cart.id
            },
            type: db.Sequelize.QueryTypes.SELECT,
            transaction: t
        })

        cart.amount = getCartSubProduct[0].cartTotalAmount;

        let deliveryChargeQuery = "SELECT COALESCE( MAX(deliverycharges.charge) , 0) as deliverycharge FROM deliverycharges WHERE deliverycharges.amount>= :amount ;"

        const getDeliveryCharge = await db.sequelize.query(deliveryChargeQuery, {
            replacements: {
                amount: getCartSubProduct[0].cartTotalAmount
            },
            transaction: t,
            type: db.Sequelize.QueryTypes.SELECT,
        })

        cart.deliveryCharge = getDeliveryCharge[0].deliverycharge

        cart.totalAmount = getCartSubProduct[0].cartTotalAmount + getDeliveryCharge[0].deliverycharge

        await cart.save({ transaction: t })
        await t.commit()

        return res.send({
            status: true,
            msg: "product is added to the cart"
        })
    } catch (error) {
        t.rollback()

        return res.send({
            status: false,
            msg: "produt is not addin to the cart"
        })
    }
}

addCartDiscount = async (req, res) => {
    const { couponCode } = req.body


    let totalAmountQuery = 'SELECT SUM(subproducts.price * cartsubproducts.quantity) AS totalAmount FROM cartsubproducts INNER JOIN subproducts ON subproducts.id = cartsubproducts.subProduct WHERE cartsubproducts.userId = :userId'

    const getTotalAmount = await db.sequelize.query(totalAmountQuery, {
        replacements: {
            userId: req.user.id
        },
        type: db.Sequelize.QueryTypes.SELECT
    })

    const getCoupon = await Coupon.findOne({
        where: {
            code: couponCode,
            deletedAt: null
        },
        attributes: ['type', 'discountType', 'discountValue', 'minAmount', 'maxDiscount'],
        include: {
            model: CouponDetail,
            as: 'couponDetails',
            attributes: ['couponTypeRefId']
        }
    })

    const couponRefId = getCoupon.couponDetails.map((value) => {
        return value.couponTypeRefId
    })

    let discountAmount, totalAmountForDiscount;
    if (getCoupon.type == 'product') {

        let query = 'SELECT COALESCE(SUM(subproducts.price*cartsubproducts.quantity),0) as subProductDiscountAmount FROM cartsubproducts INNER JOIN subproducts ON cartsubproducts.subProduct = subproducts.id WHERE cartsubproducts.userId = :userId AND subproducts.productId IN ( :productId );'

        const discountData = await db.sequelize.query(query, {
            replacements: {
                userId: req.user.id,
                productId: couponRefId
            },
            type: db.Sequelize.QueryTypes.SELECT
        })
        totalAmountForDiscount = discountData[0].subProductDiscountAmount;

    } else if (getCoupon.type == 'category') {

        let query = 'SELECT  COALESCE(SUM(subproducts.price*cartsubproducts.quantity),0) AS subProductDiscountAmount FROM subproducts INNER JOIN cartsubproducts ON cartsubproducts.subProduct = subproducts.id  INNER JOIN products ON subproducts.productId = products.id INNER JOIN subcategories ON products.subCategoryId = subcategories.id INNER JOIN categories ON subcategories.categoryId = categories.id WHERE cartsubproducts.userId = :userId AND categories.id IN (:categoryId)'

        const discountData = await db.sequelize.query(query, {
            replacements: {
                userId: req.user.id,
                categoryId: couponRefId
            },
            type: db.Sequelize.QueryTypes.SELECT
        })

        totalAmountForDiscount = discountData[0].subProductDiscountAmount;


    } else if (getCoupon.type = "all") {

        totalAmountForDiscount = getTotalAmount[0].totalAmount;

    }


    if (totalAmountForDiscount == 0) {
        return res.send({
            status: false,
            msg: `Discount Coupon is not applicable on the cart products `
        })
    }

    if (totalAmountForDiscount >= getCoupon.minAmount) {
        if (getCoupon.discountType == "percent") {
            discountAmount = Math.floor((totalAmountForDiscount * getCoupon.discountValue) / 100)
            if (discountAmount < getCoupon.maxDiscount) {
                discountAmount = getCoupon.maxDiscount
            }
        }

        if (getCoupon.discountType == "amount") {
            discountAmount = getCoupon.discountValue
        }
    }

    await Cart.update({
        couponCode: req.body.couponCode,
        discountAmount: discountAmount,
        totalAmount: getTotalAmount[0].totalAmount - discountAmount
    }, {
        where: {
            userId: req.user.id,
        }
    })

    return res.send({
        status: true,
        msg: 'coupon applied successfully'
    })
}



module.exports = {
    addCart,
    addCartDiscount,
}