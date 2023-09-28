const { Cart } = require('@models')
const db = require('@models')
const { query } = require('express')

addOrder = async (req, res) => {

    try {
        let createOrderQuery = 'INSERT INTO orders(userId,amount,totalAmount,couponCode, deliveryCharge,discountAmount) SELECT carts.userId AS userId , carts.amount AS cartAmount , carts.totalAmount AS cartTotalAmount , carts.couponCode AS cartCouponCode , carts.deliveryCharge AS cartDeliveryCharge , carts.discountAmount AS cartDiscountAmount  FROM carts WHERE userId = :userId;'


        let createOrderSubProductQuery = 'SELECT cartsubproducts.userId AS userId , :orderId AS orderId, cartsubproducts.subProduct AS orderSubProductId, cartsubproducts.quantity AS orderQuantity , 0 AS status , subproducts.price AS amount FROM cartsubproducts INNER JOIN subproducts ON cartsubproducts.subProduct = subproducts.id WHERE userId = :userId;'

        const createOrder = await db.sequelize.query(createOrderQuery, {
            replacements: {
                userId: req.user.id,
            },
        })

        await db.sequelize.query(createOrderQuery, {
            replacements: {
                userId: req.user.id,
                orderId: createOrder[0]
            },
        })

        return res.send({
            status: true,
            msg: "order has been placed successfully ",
        })

    } catch (error) {
        console.log(error)
        return res.send({
            status: true,
            msg: "order !! something went wrong",
        })
    }




}

module.exports = {
    addOrder
}
