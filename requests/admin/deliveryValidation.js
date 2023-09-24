const { body } = require('express-validator');
const { deliveryCharge } = require('@models');

addDeliveryChargeValidationRules = [
    body('amount').isInt().withMessage('amount must be integer'),
    body('charge').isInt().withMessage('charge must be integer')
        .custom(async (charge, { req }) => {
            const checkDeliveryCharge = await deliveryCharge.count({
                charge: charge,
                amount: req.body.amount
            });

            if (checkDeliveryCharge > 0) {
                throw new Error("delivery charge already exist")
            }
        }),
];

module.exports = {
    addDeliveryChargeValidationRules
}