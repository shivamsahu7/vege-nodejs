const path = require('path');
const { StatusCodes } = require('http-status-codes');
const { Category } = require('@models');
const fs = require("fs");
const { where } = require('sequelize');

categoryList = async (req, res) => {
    const pageNumber = parseInt(req.query.offset);        // The page number you want to retrieve
    const pageSize = parseInt(req.query.limit);         // The number of records per page
    const offset = (pageNumber - 1) * pageSize;

    let totalNumberOfPages = await Category.count()

    let categoryData = await Category.findAll({
        offset: offset,
        limit: pageSize,
    })

    return res.status(StatusCodes.ACCEPTED).send({
        status: true,
        totalPages:Math.ceil(totalNumberOfPages/pageSize),
        msg: "retrived data from category",
        categories: categoryData
    })
}

addCategory = async (req, res) => {

    const { name, slug } = req.body
    // file name with date
    let fileName = Date.now() + '-' + req.files.image.name

    // upload path with file name
    const categoryUploadPathWithFileName = path.resolve(process.cwd(), 'public', 'files', 'category', fileName);
    // file upload 
    req.files.image.mv(categoryUploadPathWithFileName)

    let newCategory = await Category.create({
        name: name,
        slug: slug,
        image: fileName
    })

    return res.status(StatusCodes.CREATED).json({
        status: true,
        msg: req.__('CATEGORY_ADD'),
        category: newCategory
    });
}

deleteCategory = async (req, res) => {
    try {

        const { id } = req.params

        let findUser = await Category.findOne({
            where: {
                id: id,
            },
        })

        let filePath = path.resolve(`public/files/category/${findUser.image}`)

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

        let deleteCategory = await Category.destroy({
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

updateCategory = async (req, res) => {
    // return res.send({R : 'case1'}) 
    let checkCategory = await Category.findOne({
        where: {
            id: req.params.id
        }
    })
    // return res.send({r:req.body})

    if (req.body.hasOwnProperty('name')) {
        checkCategory.name = req.body.name
    }
    if (req.body.hasOwnProperty('slug')) {

        checkCategory.slug = req.body.slug
    }
    if (req.files && req.files.image) {
        //exist file delete
        let filePath = path.resolve(process.cwd(), 'public', 'files', 'category', checkCategory.image)
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (error) => {
                if (error) {
                    console.log(error)
                }
            })
        }

        //upload new image
        let fileName = Date.now() + '-' + req.files.image.name

        // upload path with file name
        const categoryUploadPathWithFileName = path.resolve(process.cwd(), 'public', 'files', 'category', fileName);
        // file upload 
        req.files.image.mv(categoryUploadPathWithFileName)

        checkCategory.image = fileName

    }

    checkCategory.save();

    return res.status(StatusCodes.CREATED).json({
        status: true,
        msg: req.__('CATEGORY_UPDATE'),
        category: checkCategory
    });

}



module.exports = {
    categoryList,
    addCategory,
    deleteCategory,
    updateCategory
}