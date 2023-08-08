const { Product, productVariants, VariantAttributes, SubProduct } = require('@models');

addProduct = async (req, res) => {
    try {
        console.log( "start")

        const { subCategoryId, variantAttributes, subProducts } = req.body

        // product create
        const newProduct = await Product.create({
            subCategoryId: subCategoryId
        })
         
        console.log("start:2")

        // product -> variants create
        const variantAttributesKeys = Object.keys(variantAttributes)

        const variants = [];
        variantAttributesKeys.forEach(variantValue => {
            variants.push({ productId: newProduct.id, value: variantValue })
        });

        console.log("start:3")


        const newProductVariants = await productVariants.bulkCreate(variants)

        // product -> variant -> attributes create
        const attributes = [];
        newProductVariants.forEach((productVariant) => {
            variantAttributes[productVariant.value].forEach((variantAttribute) => {
                attributes.push({ variantId: productVariant.id, value: variantAttribute })
            })
        })
        console.log("start:4")

        const newVariantAttribute = await VariantAttributes.bulkCreate(attributes)

        console.log("start:5")
        
        // product -> subproduct
        // const newsubProducts = []
        let subProductImages = []; 
        await subProducts.forEach(async (subProduct) => {
            console.log("start 5.9")
            const subProductData = variantAttributesKeys.map((variant) => {
                return { [variant]: subProduct[variant] }
            })
            console.log("start:6")

            const storeNewSubProduct = await SubProduct.create({
                productId: newProduct.id,
                name: subProduct.name,
                bodyHtml: subProduct.bodyHtml,
                slug: subProduct.slug,
                price: subProduct.price,
                totalQuantity: subProduct.warehouses.reduce((sum, warehouse) => sum + warehouse.quantity, 0),
                data: JSON.stringify(subProductData)
            });

            console.log("start:7")

            console.log(storeNewSubProduct , "1")

            subProduct.images.forEach((image) => {
                subProductImages.push({
                    src: image.src,
                    alt: image.alt,
                    position: image.position,
                    productId: newProduct.id,
                    subProductId: storeNewSubProduct.id
                }) 
            })

        });
        console.log("start:8")

        console.log(subProductImages)
        return res.send({subProductImages})

        // const storeNewSubProduct = await SubProduct.bulkCreate(newsubProducts);


       //"" return res.send({ "data":  });
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    addProduct
}