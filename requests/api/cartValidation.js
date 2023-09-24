const { body } = require('express-validator');
const { SubProduct, deliveryCharge } = require('@models');

addCartValidationRules = [
    body('quantity').isInt({min:1}).withMessage(("quantity must be min 1")),
    body('subProductId').isInt().withMessage('subProduct id must be in string')
        .custom(async (subProductId) => {
            const checkSubProduct = await SubProduct.count();
            if (checkSubProduct == 0) {
                throw new Error(" subProduct is not found ")
            }
            return true
        })
    ];




module.exports = {
    addCartValidationRules,
}