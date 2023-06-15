const router = require('express').Router()
const fileupload = require('express-fileupload')

const adminMiddleware = require('@middlewares/adminAuthMiddleware.js') 
const authController = require('@controllers/admin/authController.js')
const categoryController = require('@controllers/admin/categoryController.js')
const subCategoryController = require('@controllers/admin/subCategoryController.js')
const productController = require('@controllers/admin/productController.js')

const handleValidationErrors = require('@requests/handleValidationErrors.js')

const { loginAdminValidationRules, handleloginAdminValidationErrors } = require('@requests/admin/loginValidation.js');
const { addCategoryValidationRules, addSubCategoryValidationRules, updateCategoryValidationRules , updateSubCategoryValidationRules} = require('@requests/admin/categoryValidation.js');
const { addProductValidationRules } = require('@requests/admin/productValidation.js')


router.post(
    '/login',
    loginAdminValidationRules,
    handleValidationErrors,
    authController.login
)

// router.use("/" , adminMiddleware);

router.get(
    '/add-product',
    fileupload({
        useTempFiles:true,
        tempFileDir:'public'
    }),
    productController.addProduct
)

router.get('/list-category',categoryController.categoryList)

router.post(
    '/add-category',
    fileupload({
        useTempFiles:true,
        tempFileDir:'public'
    }),
    addCategoryValidationRules,
    handleValidationErrors,
    categoryController.addCategory
)   
 
router.post( 
    '/update-category/:id',
    fileupload({
        useTempFiles:true,
        tempFileDir:'public'
    }),
    updateCategoryValidationRules,
     handleValidationErrors,
    categoryController.updateCategory
)

router.post('/delete-category/:id' , categoryController.deleteCategory)


router.post(
    '/add-subcategory',
    fileupload({
        useTempFiles:true,
        tempFileDir:'public'
    }),
    addSubCategoryValidationRules,
    handleValidationErrors,
    subCategoryController.addSubCategory
)

router.post( 
    '/update-subcategory/:id',
    fileupload({
        useTempFiles:true,
        tempFileDir:'public'
    }),
    updateSubCategoryValidationRules,
    handleValidationErrors,
    subCategoryController.updateSubCategory
)

router.post('/delete-subcategory/:id' , subCategoryController.deleteSubCategory)

router.post(
    '/add-product',
    fileupload({
        useTempFiles:true,
        tempFileDir:'public'
    }),
    addProductValidationRules,
    handleValidationErrors,
    productController.addProduct
)

module.exports = router