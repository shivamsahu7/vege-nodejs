const router = require('express').Router()

const authMiddleware = require('./../middlewares/authMiddleware.js')

const { loginUserValidationRules, handleloginUserValidationErrors } = require('./../requests/loginValidation.js');
const { registerUserValidationRules, handleregisterUserValidationErrors } = require('./../requests/registerValidation.js');

const authController = require('./../controllers/authController.js')
const userController = require('./../controllers/userController.js')


router.get(
    '/login',
    loginUserValidationRules,
    handleloginUserValidationErrors,
    authController.login
)

router.get(
    '/register',
    registerUserValidationRules,
    handleregisterUserValidationErrors,
    authController.register
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