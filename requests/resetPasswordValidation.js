const {body,validationResult} = require('express-validator');

const resetPasswordValidationRules = [
    body('email').trim().isEmail().withMessage('email is not validate'),
    body('password').isLength({min:8}).withMessage('must be at lest 8 character')
    .isLength({max:12}).withMessage('max 12 character'),
    body('token').trim().isLength({min:100}).withMessage('token is required'),
    body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Confirm password does not match');
        }
        return true;
      })
]

const handlerestPasswordValidationErrors = (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, send an error response
      return res.status(400).json({ errors: errors.array() });
    }
    // If validation succeeds, proceed to the next middleware or route handler
    next();
}

// Export the validation rules and error handling function
module.exports = {
    resetPasswordValidationRules,
    handlerestPasswordValidationErrors,
};