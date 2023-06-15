const { body } = require('express-validator');
const addProductValidationRules = [
    body('name').notEmpty(),
    body('description').notEmpty(),
    body('subCategoryId').notEmpty(),
    body('variants')
    .custom((value)=>{
        if(!Array.isArray(value) || value.length < 1){
            throw new Error('Minimum 1 variant is required')
        }
        return true;
    })
]

module.exports = {
    addProductValidationRules
}