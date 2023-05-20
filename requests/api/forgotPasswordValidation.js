const { body, validationResult } = require('express-validator');

const forgotPasswordValidationRules = [
    body('email').trim().isEmail().withMessage('email is not valid')
]

const handleForgotPasswordValidationErrors = (req,res,next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, send an error response
        return res.status(400).json({
            status:false,
            error:req.__('VALIDATION_FAILED'),
            errors: errors.array() 
        });
    }
    // If validation succeeds, proceed to the next middleware or route handler
    next();
}

module.exports = {
    forgotPasswordValidationRules,
    handleForgotPasswordValidationErrors,
};