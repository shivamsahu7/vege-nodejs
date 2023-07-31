const { query } = require('express');
const { body } = require('express-validator');
const { WareHouse } = require('@models');
const { ResultWithContextImpl } = require('express-validator/src/chain');
const { error } = require('winston');

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
    // query('id').isInt().withMessage('error wareHouse id is not found')
    // .custom(async(value , {req})=>{

    //     let checkWareHouse = await WareHouse.findOne({
    //         where:{
    //           id:value
    //         }
    //     })

    //     if(!checkWareHouse){
    //     throw new Error()
    //     }
    // }).withMessage("warehouse is not exist")
 ]

module.exports = {
    addWareHouseValidationRules,
    updateWareHouseValidationRules,
    deleteWareHouseValidationRules,
}