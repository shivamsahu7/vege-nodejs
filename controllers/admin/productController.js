const { Product } = require('@models');

addProduct = async (req,res)=>{
    const {subCategoryId} = req.body
    // console.log(req.body)
    const newProduct = await Product.create({
        subCategoryId : subCategoryId
    })
    return res.send({"data": newProduct});
}

module.exports = {
    addProduct
}