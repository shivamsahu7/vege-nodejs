const { body, validationResult } = require('express-validator');

// Example validation rule for add category

const addCategoryValidationRules = [
    body('name').notEmpty(),
    body('slug').trim(),
    body('image')    
    .custom((value, { req }) => {
        // check file extantion
        const imageFile = req.files.image;
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (!allowedMimeTypes.includes(imageFile.mimetype)) {
            throw new Error('Invalid image file format');
        }
        return true;
    })
    .custom((value, { req }) => {
        // check file size
        const imageFile = req.files.image;
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  
        if (imageFile.size > maxSizeInBytes) {
          throw new Error('Image file size exceeds the limit');
        }
        return true;
    })
];

// Function to handle validation errors
const handleaddCategoryValidationErrors = (req, res, next) => {
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
    addCategoryValidationRules,
    handleaddCategoryValidationErrors
};