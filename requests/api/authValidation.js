const { body, validationResult } = require('express-validator');

// Example validation rule for user creation
const registerUserValidationRules = [
    body('name').trim().isLength({min:3}).withMessage('name is required'),
    body('email').trim().isEmail().withMessage('email is not validate'),
    body('password').isLength({min:8}).withMessage('must be at lest 8 character')
    .isLength({max:12}).withMessage('max 12 character'),
];

// Example validation rule for user creation
const otpValidationRules = [
    body('email').trim().isEmail().withMessage('email is not validate'),
    body('otp').isLength({min:5,max:5}).withMessage('must be at lest 5 character')
];

// Example validation rule for user creation
const loginUserValidationRules = [
    body('email').trim().isEmail().withMessage('email is not validate'),
    body('password').isLength({min:8}).withMessage('must be at lest 8 character')
    .isLength({max:12}).withMessage('max 12 character'),
];

//
const forgotPasswordValidationRules = [
    body('email').trim().isEmail().withMessage('email is not valid')
]

//
const resetPasswordValidationRules = [
    body('email').trim().isEmail().withMessage('email is not validate'),
    body('password').isLength({ min: 8 }).withMessage('must be at lest 8 character')
      .isLength({ max: 12 }).withMessage('max 12 character'),
    body('token').trim().isLength({ min: 100 }).withMessage('token is required'),
    body('confirm_password').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm password does not match');
      }
      return true;
    })
  ]



// Export the validation rules and error handling function
module.exports = {
    loginUserValidationRules,
    registerUserValidationRules,
    otpValidationRules,
    forgotPasswordValidationRules,
    resetPasswordValidationRules
};