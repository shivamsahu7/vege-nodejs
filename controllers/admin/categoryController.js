const path = require('path');
const { Category } = require('@models');
const fs = require("fs")

addCategory = async (req, res) => {
    const { name, slug } = req.body
    // file name with date
    let fileName = Date.now() + '-' + req.files.image.name
    console.log(req)

    // upload path with file name
    const categoryUploadPathWithFileName = path.resolve(process.cwd(), 'public', 'files', 'category', fileName);
    // file upload 
    req.files.image.mv(categoryUploadPathWithFileName)

    let newCategory = await Category.create({
        name: name,
        slug: slug,
        image: fileName
    })
    return res.status(200).json({
        status: true,
        msg: req.__('CATEGORY_ADD'),
        category: newCategory,
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

module.exports = {
    addCategory,
    deleteCategory
}