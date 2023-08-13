const { body } = require('express-validator');

const { WareHouse, SubCategory, SubProduct } = require('@models');

const addProductValidationRules = [
    body('name').notEmpty(),
    body('subCategoryId').notEmpty().withMessage("sub-category is required")
        .isInt().withMessage("invalid subcategory")
        .custom(async (subCategoryId, { req }) => {
            let checkSubCategory = await SubCategory.findOne({
                where: {
                    id: subCategoryId,
                }
            })

            if (!checkSubCategory) {
                throw new Error("subCategory or it's ID is not found")
            }

            return true
        })

    ,
    body('variantAttributes')
        .custom((value, { req }) => {
            // minimum 1 variant
            if (Object.keys(value).length < 1) {
                throw new Error('Minimum 1 variant is require')
            }

            // every variant should be 1 attribute
            const checkKeyWithValue = Object.keys(value).every(key => value[key].length)

            if (!checkKeyWithValue) {
                throw new Error(' variant have require minimum 1 attribute')
            }
            return true;
        }),
    body('subProducts')
        .custom((value, { req }) => {

            // dynamic variant attribute validate
            const variantKeys = Object.keys(req.body.variantAttributes)

            if (!Array.isArray(value) || value.length < 1) {
                throw new Error('Subproduct must have a minimum of one');
            }

            const subProducts = req.body.subProducts

            // Extract slugs into one array
            const subProductSlugArray = subProducts.map((subProduct) => subProduct.slug);

            const hasDuplicateslugs = subProductSlugArray.length !== new Set(subProductSlugArray).size;

            if(hasDuplicateslugs){
                throw new Error('Duplicate slug in request')
            }

           let wareHouseArray = subProducts.map((subProduct)=>{
            subProduct.warehouses
           })

            // check variantAttributes is exist in subproducts
            let errors = [];

            value.forEach((currentValue, index) => {
                variantKeys.forEach((currentVariantValue) => {
                    if (!currentValue.hasOwnProperty(currentVariantValue)) {
                        errors.push(currentVariantValue)
                    }
                })
            })

            

            if (errors.length >= 1) {
                throw new Error(errors);
            } else {
                return true;
            }
        }),

    body('subProducts.*.name').notEmpty().withMessage('subProduct must be required'),
    body('subProducts.*.bodyHtml').notEmpty(),
    body('subProducts.*.slug').notEmpty().withMessage('slug is required')
        .custom(async (slug , {req}) => {
    
            // console.log(checkSlugType, "...............")

            const checkSlug = await SubProduct.findOne({
                where: {
                    slug: slug
                }
            })

            if (checkSlug) {
                throw new Error("Slug already Exist")
            }
            return true
        }),

    body('subProducts.*.price').notEmpty(),
    // warehouse validation 
    body('subProducts.*.warehouses').isArray({ min: 1 }).withMessage('warehouse must be an array with at least one item')
    .custom((wareHouses)=>{

        let wareHouseIds = wareHouses.map((wareHouse)=> wareHouse.id);

        let hasDuplicateID = wareHouses.length !== new Set(wareHouseIds).size

        if(hasDuplicateID){
            throw new Error('Duplicate wareHouses in request')
        }
        return true
    })
    ,
    body('subProducts.*.warehouses.*.id').isInt().withMessage("Warehouse is required")
        .custom(async (warehouseId) => {

            let checkWareHouse = await WareHouse.findOne({
                where: {
                    id: warehouseId,
                }
            })

            if (!checkWareHouse) {
                throw new Error("WareHouse is not Found")
            }
            return true
        }),

    // id


    body('subProducts.*.warehouses.*.quantity').isInt({ min: 0 }),
    // image validation
    body('subProducts.*.images')
        .isArray({ min: 1 }),
    body('subProducts.*.images.*.src').isString().notEmpty(),
    body('subProducts.*.images.*.alt').isString().notEmpty(),
    body('subProducts.*.images.*.position').isInt().notEmpty(),
]

const editProductValidationRules =[
]

module.exports = {
    addProductValidationRules
}