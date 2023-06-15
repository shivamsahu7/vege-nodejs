const { query } = require('express');
const { body } = require('express-validator');

const addWareHouseValidationRules = [

    body('name').notEmpty().withMessage('name is required'),

    body('state').notEmpty().withMessage('state is requiured'),

    body('city').notEmpty().withMessage('city is required'),

    body('lat')
        .notEmpty().withMessage('Latitude is required')
        .toFloat().withMessage('Latitude must be numeric')
        .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),

    body('lng')
        .notEmpty().withMessage('Longitude is required')
        .toFloat().withMessage('Longitude must be an integer')
        .isFloat({ min: -180, max: 180 }).withMessage('invalid Longitude'),
];

const updateWareHouseValidationRules = [
    body('name').optional().notEmpty().withMessage('name must be not empty').isString().withMessage('name must be in String form'),
    body('state').optional().notEmpty().withMessage('sstate must be not empty').isString(),
    body('city').optional().notEmpty().withMessage('city must be not empty').isString(),

    body('lat').optional().toFloat()
    .isFloat({min: -90 , max:90}).withMessage('Invalid Latitude'),

    body('lng').optional().toFloat()
    .isFloat({min: -180 , max:180}).withMessage('Invalid longitude'),

    body('status').notEmpty().withMessage('status code is required').isBoolean().toInt().withMessage('status code must be in 0 / 1 form, 0 => false , 1 => true'),
]

module.exports = {
    addWareHouseValidationRules,
    updateWareHouseValidationRules,
}