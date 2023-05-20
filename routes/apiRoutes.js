const router = require('express').Router()

const authMiddleware = require('@middlewares/userAuthMiddleware.js')

const authController = require('@controllers/api/authController.js')
const userController = require('@controllers/api/userController.js')

const { loginUserValidationRules, handleloginUserValidationErrors } = require('@requests/api/loginValidation.js');
const { registerUserValidationRules, handleregisterUserValidationErrors } = require('@requests/api/registerValidation.js');
const { forgotPasswordValidationRules,handleForgotPasswordValidationErrors } =require('@requests/api/forgotPasswordValidation.js')
const { resetPasswordValidationRules,handlerestPasswordValidationErrors} =require('@requests/api/resetPasswordValidation.js')


router.post(
    '/login',
    loginUserValidationRules,
    handleloginUserValidationErrors,
    authController.login
)

router.post(
    '/register',
    registerUserValidationRules,
    handleregisterUserValidationErrors,
    authController.register
)

router.post(
    '/forgot-password',
    forgotPasswordValidationRules,
    handleForgotPasswordValidationErrors,
    authController.forgotPassword
)

router.post(
    '/reset-password',
    resetPasswordValidationRules,
    handlerestPasswordValidationErrors,
    authController.resetPassword
)

// apply middleware on all routes
router.use('/',authMiddleware)

router.get(
    '/profile',
    userController.profile
)

router.post(
    '/logout',
    userController.logout
)

module.exports = router