const { personalAccessToken } = require('@models');
const db = require('@models');
const { SubProduct, Cart, cartSubProduct, deliveryCharge } = require('@models');

profile = async (req, res) => {
    try {
        return res.status(200).json({
            status: true,
            msg: req.__('PROFILE_DETAIL'),
            user: req.user,
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            status: false,
            error: req.__('SERVER_ISSUE')
        });
    }
}

logout = async (req, res) => {
    try {
        const temp = req.headers.authorization
        token = temp.split(" ")[1]
        splittedToken = token.split("|")
        const deletePersonalAccessToken = await personalAccessToken.destroy({
            where: {
                id: splittedToken[0]
            }
        })
        if (deletePersonalAccessToken) {
            return res.status(200).json({
                status: true,
                msg: req.__('LOGOUT_MSG')
            })
        } else {
            return res.status(400).json({
                status: false,
                error: req.__('TOKEN_NOT_VALID')
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            status: false,
            error: req.__('SERVER_ISSUE')
        });
    }
}

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


module.exports = {
    profile,
    logout,
    addCart,
}