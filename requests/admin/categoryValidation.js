const { body } = require('express-validator');
const{ Category, SubCategory } = require('@models')
const { Op } = require('sequelize');

const addCategoryValidationRules = [
    body('name').notEmpty(),
    body('slug').trim()
    .custom(async(value)=>{
        const checkCategory = await Category.findOne({
            where:{
                slug: value
            }
        })
        if(checkCategory){
            throw new Error('slug already Exist')
        }
        return true
    }),   
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

const addSubCategoryValidationRules = [

    //name
    body('name').notEmpty().withMessage('name is required').isString().withMessage("name must be a string"),
    //image
    body('image')
    .custom(async (value, { req }) => {

        const imageFile = req.files.image;


        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (!allowedMimeTypes.includes(imageFile.mimetype)) {
            throw new Error('Invalid image file format');
        }
        return true;
    })
    .custom((value, { req }) => {
        // check file size
        const imageFile = req.files.image
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

        if (imageFile.size > maxSizeInBytes) {
            throw new Error('Image file size exceeds the limit');
        }
        return true;
    }),
    //slug
    body('slug').notEmpty().trim().withMessage('Slug must be a string')
    .custom(async (value) => {
        // check slug is allready exist
        let fetchCategory = await SubCategory.findOne({
            where: {
                slug: value
            }
        })
        if (fetchCategory) {
            throw new Error('Slug already Exist')
        }
        return true;
    }),
        //status
    body('status').isBoolean().withMessage('Status is set in 0 / 1 format'),
    body('categoryId').notEmpty().withMessage('Category id is empty')
    .custom(async (value)=>{
        // check slug is allready exist
        let fetchCategory = await Category.findOne({
            where:{
                id:value
            },
        })
        
        if(!fetchCategory){
            throw new Error('Category does not exist')
        }
        return true;
    })
];

const updateCategoryValidationRules = [
    body('name').optional().notEmpty(),
    body('slug').optional().trim()
    .custom(async(value,{req})=>{
        const checkCategory = await SubCategory.findOne({
            where:{
                slug: value,
                id:{
                    [Op.not]:req.params.id
                }
            }
        })
        // ex:- db.raw('SELECT * FROM `categories` where slug = "vegetables-fruits" AND NOT id =2')
        if(checkCategory){
            throw new Error('slug already Exist')
        }
        return true
    }),
    body('image').optional()    
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

const updateSubCategoryValidationRules = [
    body('name').optional().notEmpty(),
    body('slug').optional().trim()
    .custom(async(value,{req})=>{
        const checkSubCategory = await SubCategory.findOne({
            where:{
                slug: value,
                id:{
                    [Op.not]:req.params.id
                }
            }
        })
        // ex:- db.raw('SELECT * FROM `categories` where slug = "vegetables-fruits" AND NOT id =2')
        if(checkSubCategory){
            throw new Error('slug already Exist')
        }
        return true
    }),
    body('image').optional()    
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


module.exports = {
    addCategoryValidationRules,
    updateCategoryValidationRules,
    addSubCategoryValidationRules,
    updateSubCategoryValidationRules,
};