const router = require('express').Router()
const adminMiddleware = require('@middlewares/adminAuthMiddleware.js') 
const authController = require('@controllers/admin/authController.js')
const categoryController = require('@controllers/admin/categoryController.js')

const { loginAdminValidationRules, handleloginAdminValidationErrors } = require('@requests/admin/loginValidation.js');

router.post(
    '/login',
    loginAdminValidationRules,
    handleloginAdminValidationErrors,
    authController.login
)

router.use("/" , adminMiddleware);

router.post(
    'add-catgory',
    categoryController.addCategory
)

module.exports = router