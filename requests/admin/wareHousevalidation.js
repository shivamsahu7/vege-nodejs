const { query } = require('express');
const { body, param } = require('express-validator');
const { WareHouse } = require('@models');
const { moment } = require('moment')


const addWareHouseValidationRules = [

    body('name').notEmpty().withMessage('name is required'),

    body('state').notEmpty().withMessage('state is requiured'),

    body('city').notEmpty().withMessage('city is required'),

    body('lat')
        .notEmpty().withMessage('Latitude is required')
        .toFloat().withMessage('Latitude must be an float')
        .isFloat({ min: -90, max: 90 }).withMessage('invalid Latitude')
        .custom(async (value, { req }) => {
            const {lat,lng} = req.body
            console.log("first", value)
            let fetchWareHouse = await WareHouse.findOne({
                where: {
                    lat: lat,
                    lng: lng
                }
            });
            console.log(fetchWareHouse , "fetch")
        })
        ,

    body('lng')
        .notEmpty().withMessage('Longitude is required')
        .toFloat().withMessage('Longitude must be an float')
        .isFloat({ min: -180, max: 180 }).withMessage('invalid Longitude')
];

const updateWareHouseValidationRules = [

    body('name').optional().notEmpty().withMessage('name must be not empty').isString().withMessage('name must be in String form'),
   
    body('state').optional().notEmpty().withMessage('sstate must be not empty').isString(),
    
    body('city').optional().notEmpty().withMessage('city must be not empty').isString(),

    body('lat').toFloat().
        isFloat({ min: -90, max: 90 }).withMessage('Invalid Latitude'),

    body('lng').optional().toFloat()
        .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),

    body('status').notEmpty().withMessage('status code is required').isBoolean().toInt().withMessage('status code must be in 0 / 1 form, 0 => false , 1 => true'),

]

 const deleteWareHouseValidationRules = [
    param('id').isInt().withMessage('invalid response')
    .custom(async(value )=>{
        let checkWareHouse = await WareHouse.findOne({
            where:{
              id:value
            }
        })
        console.log(checkWareHouse)

        // checkWareHouse.deletedAt = 
        if(!checkWareHouse){
        throw Error('wareHouse is not found');
        }
    })
 ]

module.exports = {
    addWareHouseValidationRules,
    updateWareHouseValidationRules,
    deleteWareHouseValidationRules,
}