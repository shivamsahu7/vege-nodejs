const { body, param } = require('express-validator');
const { Op } = require('sequelize');
const { WareHouse, SubCategory, SubProduct, Product, productVariants, VariantAttributes, productImages } = require('@models');
const db = require('../../models/index.js')
const { log } = require('winston');

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

            if (hasDuplicateslugs) {
                throw new Error('Duplicate slug in request')
            }

            let wareHouseArray = subProducts.map((subProduct) => {
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
        .custom(async (slug, { req }) => {


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
        .custom((wareHouses) => {

            let wareHouseIds = wareHouses.map((wareHouse) => wareHouse.id);

            let hasDuplicateID = wareHouses.length !== new Set(wareHouseIds).size

            if (hasDuplicateID) {
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

const editProductValidationRules = [
    param('id').isInt().withMessage('id should be an integer')
        .custom(async (id, { req }) => {
            let checkProduct = await Product.count({
                where: {
                    id: id
                }
            });

            if (checkProduct == 0) {
                throw new Error("no product found ")
            }

            return true
        }),
    body('subCategoryId').isInt().withMessage('Category id is not fount')
        .custom(async (subCategoryId, { req }) => {
            let checkSubCategory = await SubCategory.count({
                where: {
                    id: subCategoryId
                }
            })
            if (checkSubCategory == 0) {
                throw new Error('subCategory is not found')
            }
            return true
        })
]

editProductVariantValidationRules = [
    param('variantId').isInt().withMessage('productVariants is not found')
        .custom(async (productVariantId) => {
            const findProductVariants = await productVariants.count({
                where: {
                    id: productVariantId
                }
            });
            if (findProductVariants == 0) {
                throw Error("Product variants are not found")
            }
            return true
        }),
    body('value').isString().withMessage('value must be string')
];

editVariantAttributeValidationRules = [
    param('attributeId').isInt().withMessage('Attribute Id must be integer')
        .custom(async (attributeId) => {
            const checkVariantAttributes = await VariantAttributes.count({
                where: {
                    id: attributeId
                }
            })

            if (checkVariantAttributes == 0) {
                throw new Error("No attribute exist")
            }
            return true
        }),

]

editSubProductValidationRules = [
    param('subProductId').isInt().withMessage('subProduct Id must be integer')
        .custom(async (subProductId) => {

            const checksubProduct = await SubProduct.count({
                where: {
                    id: subProductId
                }
            })
            if (checksubProduct == 0) {
                throw new Error("No attribute exist")
            }
            return true
        }),
    body('name').isString().withMessage('name must be String'),
    body('bodyHtml').isString().withMessage('bodyHTML must be String'),
    body('slug').isString().withMessage('slug must be in String')
        .custom(async (slug, { req }) => {
            const checkSlug = await SubProduct.findOne({
                where: {
                    slug: slug,
                    id: {
                        [Op.not]: req.params.id,
                    }
                }
            })

            if (checkSlug != null) {
                throw new Error('duplicate slug')
            }
            return true
        }),
    body('price').isInt().withMessage('price must be intiger'),
    body('data').isObject().withMessage('data must be json Type')
        .custom(async (data, { req }) => {
            const subProduct = await SubProduct.findOne({
                where: {
                    id: req.params.subProductId
                },
                attributes: [],
                include: {
                    model: productVariants,
                    as: 'productVariants',
                    attributes: ['id', 'value'],
                    include: {
                        model: VariantAttributes,
                        as: 'variatAttributes',
                        attributes: ['id', 'value']
                    }
                }
            })

            let errors = []
            subProduct.productVariants.forEach((variant) => {
                if (!data.hasOwnProperty(variant.value)) {
                    errors.push(variant.value)
                    return;
                }
                const attributes = variant.variatAttributes.map((attribute) => {
                    return attribute.value
                })
                if (!attributes.includes(req.body.data[[variant.value]])) {
                    errors.push(req.body.data[[variant.value]])
                }
            })

            if (errors.length >= 1) {
                throw new Error(errors);
            } else {
                return true;
            }
        })


]

addSubProductImageValidationRules = [
    body('position').isInt().withMessage('position must be in intiger'),
    param('subproductId').isInt().withMessage("subProduct id must be in integer")
        .custom(async (subProductId, { req }) => {

            const findSubProduct = await SubProduct.count({
                where: {
                    id: subProductId
                },
            })
            console.log(findSubProduct.productImage)

            if (findSubProduct == 0) {
                throw new Error('subproduct is not found')
            }
            return true
        }),
    body('src').isString().withMessage('Src must be in string'),
    body('alt').isString().withMessage('Alt must be in string'),
]

editSubProductTotalQuantityValidationRules = [
    param('subProductId').isInt().withMessage('subProduct id must be integer')
        .custom(async (subProductId, { req }) => {

            const findSubProduct = await SubProduct.count({
                where: {
                    id: subProductId
                },
            })



            if (findSubProduct == 0) {
                throw new Error('subproduct is not found')
            }
            return true
        }),
    body('action').isIn(['add', 'subtract']).withMessage('action must be add or subtract'),
    body('quantity').isInt({ min: 1 }).withMessage('quantity must be an integer')
        .custom(async (quantity, { req }) => {
            console.log('case 0.7')
            if (req.body.action == 'subtract') {

                let query = "SELECT SUM(CASE WHEN actionType = 'add' THEN quantity ELSE 0 END) - SUM(CASE WHEN actionType='subtract' THEN quantity ELSE 0 END) AS totalQuantity FROM `warehousestockhistories` WHERE subProductId = :subProductId AND warehouseId = :warehouseId;"
                console.log('case 0.8')
                const subProductTotalQuantity = await db.sequelize.query(query,
                    {
                        replacements: {
                            subProductId: req.params.subProductId,
                            warehouseId: req.body.warehouseId
                        },
                        type: db.sequelize.QueryTypes.SELECT
                    })
                    console.log(subProductTotalQuantity[0])
                    console.log('case 0.9')
                if (quantity > subProductTotalQuantity[0].totalQuantity) {
                    console.log('case 1')
                    throw new Error('Quantity must be less than ' + subProductTotalQuantity[0].totalQuantity)
                }
            }
            
            return true
        }),
    body('warehouseId').isInt().withMessage('wareHouse must be Integer')
        .custom(async (wareHouseId) => {
            const checkWareHouse = await WareHouse.count({
                where: {
                    id: wareHouseId
                }
            })

            if (checkWareHouse === 0) {
                throw new Error('No wareHouse Exist')
            }
            return true;
        })
]
module.exports = {
    addProductValidationRules,
    addSubProductImageValidationRules,
    editProductValidationRules,
    editProductVariantValidationRules,
    editVariantAttributeValidationRules,
    editSubProductValidationRules,
    editSubProductTotalQuantityValidationRules
}