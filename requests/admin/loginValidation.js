const { body, validationResult } = require('express-validator');

// Example validation rule for user creation
const loginAdminValidationRules = [
    body('email').trim().isEmail().withMessage('email is not validate'),
    body('password').isLength({min:8}).withMessage('must be at lest 8 character')
    .isLength({max:12}).withMessage('max 12 character'),
];

// Function to handle validation errors
const handleloginAdminValidationErrors = (req, res, next) => {
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
};

// Export the validation rules and error handling function
module.exports = {
    loginAdminValidationRules,
    handleloginAdminValidationErrors,
};