const router = require('express').Router()
const fileupload = require('express-fileupload')

const adminMiddleware = require('@middlewares/adminAuthMiddleware.js') 
const authController = require('@controllers/admin/authController.js')
const categoryController = require('@controllers/admin/categoryController.js')

const { loginAdminValidationRules, handleloginAdminValidationErrors } = require('@requests/admin/loginValidation.js');
const { addCategoryValidationRules, handleaddCategoryValidationErrors } = require('@requests/admin/addcategoryValidation.js');
const { updateCategoryValidationRules, handleupdateCategoryValidationErrors } = require('@requests/admin/updatecategoryValidation.js');


router.post(
    '/login',
    loginAdminValidationRules,
    handleloginAdminValidationErrors,
    authController.login
)

router.use("/" , adminMiddleware);

router.post(
    '/add-category',
    fileupload({
        useTempFiles:true,
        tempFileDir:'public'
    }),
    addCategoryValidationRules,
    handleaddCategoryValidationErrors,
    categoryController.addCategory
)

// router.post(
//     '/update-category',
//     fileupload({
//         useTempFiles:true,
//         tempFileDir:'public'
//     }),
//     updateCategoryValidationRules,
//     handleupdateCategoryValidationErrors
// )

router.post('/delete-category/:id' , categoryController.deleteCategory)


module.exports = router