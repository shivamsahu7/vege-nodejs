const { Product,productVariants,VariantAttributes } = require('@models');

addProduct = async (req,res)=>{
    try{
        return res.send({req:req.body})
        const {subCategoryId,variantAttributes} = req.body

        // product create
        const newProduct = await Product.create({
            subCategoryId : subCategoryId
        })

        // product -> variants create
        variantAttributesKeys = Object.keys(variantAttributes)

        const variants = [];
        variantAttributesKeys.forEach(variantValue => {
            variants.push({productId:newProduct.id,value:variantValue})
        });

        const newProductVariants = await productVariants.bulkCreate(variants)

        // product -> variant -> attributes create
        const attributes = [];
        newProductVariants.forEach((productVariant)=>{
            variantAttributes[productVariant.value].forEach((variantAttribute)=>{
                attributes.push({variantId:productVariant.id,value:variantAttribute})
            })
        })

        const newVariantAttribute = await VariantAttributes.bulkCreate(attributes)

        return res.send({"data": newVariantAttribute});
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    addProduct
}