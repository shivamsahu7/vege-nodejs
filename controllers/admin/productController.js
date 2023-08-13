const {SubCategory, Product, productVariants, VariantAttributes, SubProduct, productImages, WarehouseStockHistory } = require('@models');
const {StatusCodes}  = require('http-status-codes')
// const db = require("@models/index.js")
addProduct = async (req, res) => {
    try {
        console.log("start")

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
        const newsubProducts = []

        subProducts.forEach(async (subProduct) => {
            const subProductData = variantAttributesKeys.map((variant) => {
                return { [variant]: subProduct[variant] }
            })

            newsubProducts.push({
                productId: newProduct.id,
                name: subProduct.name,
                bodyHtml: subProduct.bodyHtml,
                slug: subProduct.slug,
                price: subProduct.price,
                totalQuantity: subProduct.warehouses.reduce((sum, warehouse) => sum + warehouse.quantity, 0),
                data: JSON.stringify(subProductData)
            })
        });

        const storeNewSubProduct = await SubProduct.bulkCreate(newsubProducts);

        let subProductImages = [];
        let subProductWarehouseHistory = []

        let i = 0;
        subProducts.forEach(async (subProduct) => {
            // product -> subproduct -> subproduct images
            subProduct.images.forEach((image) => {
                subProductImages.push({
                    src: image.src,
                    alt: image.alt,
                    position: image.position,
                    productId: newProduct.id,
                    subProductId: storeNewSubProduct[i]['id']
                })
            })

            // product -> subproduct -> warehouse history
            subProduct.warehouses.forEach((wareHouseHistory) => {
                subProductWarehouseHistory.push({
                    warehouseId: wareHouseHistory.id,
                    subProductId: storeNewSubProduct[i]['id'],
                    quantity: wareHouseHistory.quantity,
                    actionType: "add"
                })
            })
            i++;
        });
        const storeSubProductImages = await productImages.bulkCreate(subProductImages);
        const storeWareHouseHistory = await WarehouseStockHistory.bulkCreate(subProductWarehouseHistory);

        return res.status(200).send({
            status: true,
            msg: req.__('PRODUCT_ADDED')

        });
    } catch (err) {
        console.log(err)
    }
}

getProductDetail = async(req, res) => {
    const {id} = req.params
 
    const productData = await Product.findOne({
        where:{
            id:id
        },
        include: [
            {
                model:SubProduct,
                as:"subProducts",
                include: {
                    model:productImages,
                    as:"productImages",
                }
            },{
                model:SubCategory,
                as:"subCategory"
            },{
                model:productVariants,
                as:"productVariants",
                include:{
                    model:VariantAttributes,
                    as:"variatAttributes"
                }
            }
        ]
    })
    
    return res.send({productData});
    // relation data one-to-many
    // const data = await db.Users.findAll({
    //     include:{
    //         model:db.Posts,
    //         attributes:["id","title","content"]
    //     },
    //     where:{id:1}
    // })


    const mergeProductData = sequelize.define(Product, {
        subCategoryId: Sequelize.INT,
    });

    const mergeSubProductData = sequelize.define(SubProduct, {
        id: Sequelize.INT,
    });

    // Product.hasMany(subProduct , )
}

productList = async (req , res)=>{
    const pageNumber = parseInt(req.query.offset);        // The page number you want to retrieve
    const pageSize = parseInt(req.query.limit);         // The number of records per page
    const offset = (pageNumber - 1) * pageSize;

    let totalNumberOfPages = await Product.count()

    let productData = await Product.findAll({
        offset: offset,
        limit: pageSize,
    })

    return res.status(StatusCodes.ACCEPTED).send({
        status:true,
        msg:req.__('PRODUCT_LIST'),
        totalPages:Math.ceil(totalNumberOfPages/pageSize),
        products:productData
    })
}

editProduct = (req , res)=>{

}

module.exports = {
    addProduct,
    getProductDetail,
    productList,
    editProduct
}