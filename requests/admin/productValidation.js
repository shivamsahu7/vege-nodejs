const { body } = require('express-validator');
const addProductValidationRules = [
    body('name').notEmpty(),
    body('description').notEmpty(),
    body('subCategoryId').notEmpty(),
    body('variantAttributes')
    .custom((value,{req})=>{
        // minimum 1 variant
        if(Object.keys(value).length < 1){
            throw new Error('Minimum 1 variant is require')
        }

        // every variant should be 1 attribute
        const checkKeyWithValue = Object.keys(value).every(key => value[key].length)

        if(!checkKeyWithValue){
            throw new Error(' variant have require minimum 1 attribute')
        }
        return true;
    }),
    body('subProducts')
    .custom((value,{req})=>{
        // dynamic variant attribute validate
        const variantKeys = Object.keys(req.body.variantAttributes)

        if(!Array.isArray(value) || value.length < 1){
            throw new Error('Subproduct must have a minimum of one');
        }
        
        let errors = [];
        value.forEach((currentValue,index)=>{
            variantKeys.forEach((currentVariantValue)=>{
                if(!currentValue.hasOwnProperty(currentVariantValue)){
                    errors.push(currentVariantValue)
                }
            })
        })
        console.log(errors);
        if(errors.length >= 1){
            throw new Error(errors);
        }else{
            return true;
        }
    }),
    body('subProducts.*.name').notEmpty(),
    body('subProducts.*.slug').notEmpty(),
    body('subProducts.*.price').notEmpty(),
    body('subProducts.*.warehouse')
    .optional({ checkFalsy: true })
    .isArray({ min: 1 })
    .withMessage('warehouse must be an array with at least one item'),
    body('subProducts.*.warehouse.*.id')
    .optional({ checkFalsy: true })
    .isNumeric({ min: 1 })
    .withMessage('warehouse id must be a positive number'),
    body('subProducts.*.warehouse.*.quantity')
    .optional({ checkFalsy: true })
    .isNumeric({ min: 0 })
    .withMessage('warehouse quantity must be a non-negative number'),
]

module.exports = {
    addProductValidationRules
}