const { Cart } = require('@models')
const db = require('@models')
const { query } = require('express')
const Razorpay = require('razorpay')

addOrder = async (req, res) => {
    try {
        // let createOrderQuery = 'INSERT INTO orders(userId,amount,totalAmount,couponCode, deliveryCharge,discountAmount) SELECT carts.userId AS userId , carts.amount AS cartAmount , carts.totalAmount AS cartTotalAmount , carts.couponCode AS cartCouponCode , carts.deliveryCharge AS cartDeliveryCharge , carts.discountAmount AS cartDiscountAmount  FROM carts WHERE userId = :userId;'

        // let createOrderSubProductQuery = 'INSERT INTO ordersubproducts(userId,orderId,subProductId,quantity,status, amount) SELECT cartsubproducts.userId AS userId , :orderId AS orderId, cartsubproducts.subProduct AS orderSubProductId, cartsubproducts.quantity AS orderQuantity , 0 AS status , subproducts.price AS amount FROM cartsubproducts INNER JOIN subproducts ON cartsubproducts.subProduct = subproducts.id WHERE userId = :userId;'

        // const createOrder = await db.sequelize.query(createOrderQuery, {
        //     replacements: {
        //         userId: req.user.id,
        //     },
        // })
        
        // await db.sequelize.query(createOrderSubProductQuery, {
        //     replacements: {
        //         userId: req.user.id,
        //         orderId: createOrder[0]
        //     },
        // });

//         let query ="SELECT cartsubproducts.subProduct AS subProductId , cartsubproducts.quantity AS quantity ,  warehouses.id AS wareHouseId , warehouses.lat AS wareHouseLat, warehouses.lng AS wareHouseLng ,
 
//         MIN((
//             6371 * ACOS(
//                 COS(RADIANS(23.229555)) * COS(RADIANS(warehouses.lat)) *
//                 COS(RADIANS( warehouses.lng) - RADIANS( 77.443834)) +
//                 SIN(RADIANS(23.229555)) * SIN(RADIANS(warehouses.lat))
//             )
//         ) )AS distance_in_km
//     FROM cartsubproducts INNER JOIN warehousesubproductquantities ON cartsubproducts.subProduct = warehousesubproductquantities.subProductId INNER JOIN warehouses
//     ON warehousesubproductquantities.wareHouseId = warehouses.id 
// WHERE  cartsubproducts.userId = 1 AND cartsubproducts.quantity warehousesubproductquantities.totalQuantity GROUP BY cartsubproducts.subProduct"

        return res.send({
            status: true,
            msg: " order !!! is placed  ",
        })

    } catch (error) {
        console.log(error)
        return res.send({
            status: true,
            msg: "order !! something went wrong",
        })
    }
}

paymentGateway = (req, res) => {
    const { amount } = req.body;

    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    instance.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: "devanshsahu7000@gamil.com"
    }, (error, order) => {
        if (error) {
            console.log(error);
        } else if (order) {
            console.log(order);
        }
    })
}

module.exports = {
    addOrder
}
