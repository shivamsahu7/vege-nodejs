const { body } = require('express-validator');
const { SubProduct, deliveryCharge, Coupon } = require('@models');

addCartValidationRules = [
    body('quantity').isInt({ min: 1 }).withMessage(("quantity must be min 1")),
    body('subProductId').isInt().withMessage('subProduct id must be in string')
        .custom(async (subProductId) => {
            const checkSubProduct = await SubProduct.count();
            if (checkSubProduct == 0) {
                throw new Error(" subProduct is not found ")
            }
            return true
        })
];

addCartDiscountValidationRules = [
body('couponCode').isString().withMessage('coupon must be string')
.custom(async(couponCode)=>{
    const checkCoupon = await Coupon.count({
        where:{
            code:couponCode
        }
    })
    
    if(checkCoupon !==1 ){throw new Error("invalid coupon")}
    return true
})
]




module.exports = {
    addCartValidationRules,
    addCartDiscountValidationRules
}