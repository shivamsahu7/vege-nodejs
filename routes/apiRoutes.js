const router = require('express').Router()

const authMiddleware = require('@middlewares/userAuthMiddleware.js')

const authController = require('@controllers/api/authController.js')
const userController = require('@controllers/api/userController.js')

const handleValidationErrors = require('@requests/handleValidationErrors.js')

const { loginUserValidationRules,registerUserValidationRules,otpValidationRules,forgotPasswordValidationRules,resetPasswordValidationRules } = require('@requests/api/authValidation.js');



router.post(
    '/login',
    loginUserValidationRules,
    handleValidationErrors,
    authController.login
)

router.post(
    '/register',
    registerUserValidationRules,
    handleValidationErrors,
    authController.register
)

router.post(
    '/otp-verify',
    otpValidationRules,
    handleValidationErrors,
    authController.otpVerify
)

router.post(
    '/forgot-password',
    forgotPasswordValidationRules,
    handleValidationErrors,
    authController.forgotPassword
)

router.post(
    '/reset-password',
    resetPasswordValidationRules,
    handleValidationErrors,
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