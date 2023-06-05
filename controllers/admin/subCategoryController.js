const path = require('path');
const { StatusCodes } = require('http-status-codes');
const { SubCategory } = require('@models');
const fs = require("fs");
const { check } = require('express-validator');

addSubCategory = async (req, res) => {
    const { name, slug, categoryId } = req.body
    // file name with date
    let fileName = Date.now() + '-' + req.files.image.name

    // upload path with file name
    const subCategoryUploadPathWithFileName = path.resolve(process.cwd(), 'public', 'files', 'sub-category', fileName);
    // file upload 
    req.files.image.mv(subCategoryUploadPathWithFileName)

    let newSubCategory = await SubCategory.create({
        name: name,
        slug: slug,
        image: fileName,
        categoryId: categoryId
    })

    return res.status(StatusCodes.CREATED).json({
        status: true,
        msg: req.__('CATEGORY_ADD'),
        subCategory: newSubCategory
    });
}

updateSubCategory = async (req, res) => {

    const subCategoryId = req.params.id
    const { name, slug } = req.body

    let checkSubCategory = await SubCategory.findOne({
        where: {
            id: subCategoryId
        }
    })

    if (name) {
        checkSubCategory.name = name
    }
    if (slug) {
        checkSubCategory.slug = slug
    }

    console.log(req.files)
    

    if (req.files && req.files.image) {
        
        //exist file
        let filePath = path.resolve(process.cwd(), "public", "files", "sub-category", checkSubCategory.image)

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (error) => {
                console.log(error)
            })
        }
        
        //create image name
        let fileName = Date.now() + '-' + req.files.image.name

        // upload path with file name
        const categoryUploadPathWithFileName = path.resolve(process.cwd(), 'public', 'files', 'category', fileName);
        // file upload 
        req.files.image.mv(categoryUploadPathWithFileName)

        checkSubCategory.image = fileName
    }
    checkSubCategory.save()
    return res.status(StatusCodes.CREATED).json({
        status: true,
        msg: req.__('SUBCATEGORY_UPDATE'),
        subCategory: newSubCategory
    });
}

deleteSubCategory = async (req, res) => {

    try {
        const { id } = req.params

        let findUser = await SubCategory.findOne({
            where: {
                id: id,
            },
        })

        // let filePath = path.resolve(`public/files/sub-category/${findUser.image}`)
        let filePath = path.resolve(process.cwd(), 'public', 'files', 'sub-category', findUser.image);

        if (fs.existsSync(filePath)) {

            fs.unlink(filePath, (error) => {
                if (error) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('File deleted successfully');
                }
            })
        } else {
            console.log('File does not exist');
        }

        let deleteSubCategory = await SubCategory.destroy({
            where: {
                id: id,
            }
        })

        return res.status(200).send({
            status: true,
            msg: req.__('CATEGORY_DELETE'),
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({ error: req.__('SERVER_ISSUE') });
    }
}

module.exports = {
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
}