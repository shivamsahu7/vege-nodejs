const path = require('path');
const  { StatusCodes } = require('http-status-codes');
const { Category } = require('@models');

addCategory = async(req,res)=>{
    const { name,slug }= req.body
    // file name with date
    let fileName = Date.now()+'-'+ req.files.image.name
    // upload path with file name
    const categoryUploadPathWithFileName = path.resolve(process.cwd(),'public','files', 'category',fileName);
    // file upload 
    req.files.image.mv(categoryUploadPathWithFileName)

    let newCategory = await Category.create({
        name:name,
        slug:slug,
        image:fileName
    })
    return res.status(StatusCodes.CREATED).json({
        status:true,
        msg:req.__('CATEGORY_ADD'),
        category:newCategory
    });
}

module.exports = {
    addCategory
}