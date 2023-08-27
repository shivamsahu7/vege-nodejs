const { SubCategory, Product, productVariants, VariantAttributes, SubProduct, productImages, WarehouseStockHistory } = require('@models');
const { StatusCodes } = require('http-status-codes')
const { Sequelize, QueryTypes } = require('sequelize');
const db = require('../../models')
const { sequelize } = require('../../models')
// const db = require("@models/index.js")
addProduct = async (req, res) => {
    try {

        const { subCategoryId, variantAttributes, subProducts, name } = req.body

        // product create
        const newProduct = await Product.create({
            subCategoryId: subCategoryId,
            name: name
        })

        // product -> variants create
        const variantAttributesKeys = Object.keys(variantAttributes)

        const variants = [];
        variantAttributesKeys.forEach(variantValue => {
            variants.push({ productId: newProduct.id, value: variantValue })
        });

        const newProductVariants = await productVariants.bulkCreate(variants)

        // product -> variant -> attributes create
        const attributes = [];
        newProductVariants.forEach((productVariant) => {
            variantAttributes[productVariant.value].forEach((variantAttribute) => {
                attributes.push({ variantId: productVariant.id, value: variantAttribute })
            })
        })

        const newVariantAttribute = await VariantAttributes.bulkCreate(attributes)

        // product -> subproduct
        const newsubProducts = []

        subProducts.forEach(async (subProduct) => {
            // const subProductData = variantAttributesKeys.map((variant) => {
            //     return { [variant]: subProduct[variant] }
            // })
            const subProductData = {}
            variantAttributesKeys.forEach((variant) => {
                subProductData[[variant]] = subProduct[variant]
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

getProductDetail = async (req, res) => {
    const { id } = req.params

    const productData = await Product.findOne({
        where: {
            id: id
        },
        include: [
            {
                model: SubProduct,
                as: "subProducts",
                include: {
                    model: productImages,
                    as: "productImages",
                }
            }, {
                model: SubCategory,
                as: "subCategory"
            }, {
                model: productVariants,
                as: "productVariants",
                include: {
                    model: VariantAttributes,
                    as: "variatAttributes"
                }
            }
        ]
    })

    return res.send({ productData });
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

productList = async (req, res) => {
    const pageNumber = parseInt(req.query.offset);        // The page number you want to retrieve
    const pageSize = parseInt(req.query.limit);         // The number of records per page
    const offset = (pageNumber - 1) * pageSize;

    let totalNumberOfPages = await Product.count()

    let productData = await Product.findAll({
        offset: offset,
        limit: pageSize,
    })

    return res.status(StatusCodes.ACCEPTED).send({
        status: true,
        msg: req.__('PRODUCT_LIST'),
        totalPages: Math.ceil(totalNumberOfPages / pageSize),
        products: productData
    })
}

editProduct = async (req, res) => {

    const productData = await Product.update({
        name: req.body.name,
        subCategoryId: req.body.subCategoryId
    }, {
        where: {
            id: req.params.id
        }
    })
    if (productData[0] >= 1) {
        return res.status(StatusCodes.ACCEPTED).send({
            status: true,
            msg: req.__('UPDATE_PRODUCT')
        })
    } else {
        return res.status(StatusCodes.BAD_REQUEST).send({
            status: false,
            msg: req.__("NOT_UPDATE_PRODUCT")
        })
    }
}

editProductVariants = async (req, res) => {
    const productVariantUpdate = await productVariants.update({
        value: req.body.value
    }, {
        where: {
            id: req.params.variantId
        }
    })
    
    if (productVariantUpdate == 0) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            status: true,
            msg: req.__("PRODUCT_VARIANT_NOT_UPDATED")
        })
    } else {
        return res.status(StatusCodes.ACCEPTED).send({
            status: true,
            msg: req.__("PRODUCT_VARIANT_UPDATED")
        })
    }
}

addVariantAttribute = async (req, res) => {
    const t = sequelize.transaction()
    try {
        const variantAttributes = req.body.variantAttributes;

        //create variants
        const newProductVariat = [];
        const productvariants = Object.keys(variantAttributes);

        productvariants.forEach((variant) => {
            newProductVariat.push({ productId: req.params.productId, value: variant })
        })

        const createProductVariat = await productVariants.bulkCreate(newProductVariat,{transaction:t});
       // [{},{},{}]

        const attributes = [];
        //createAttributes
        createProductVariat.forEach((variant) => {
            // {id:1,value:red}
            variantAttributes[variant.value].forEach((variantAttribute)=>{ //["s23","s3 plus","s23 ultra"]
                attributes.push({ variantId: variant.id, value: variantAttribute })
            })
        })
        // [{},{},{}]
        const createVariantsAttributes = await VariantAttributes.bulkCreate(attributes,{transaction:t})

        t.commit()
        
        return res.status(StatusCodes.ACCEPTED).send({
            status: true,
            msg: "variant attribute has been updated"
        })
    } catch (error) {
        console.log(error)
        t.rollback()
        return res.status(StatusCodes.BAD_REQUEST).send({
            status: false,
            msg: error
        })
    }
}

editVariantAttribute = async (req, res) => {
    const updateVariantAttributes = await VariantAttributes.update({
        value: req.body.value
    }, {
        where: {
            id: req.params.attributeId
        }
    })

    if (updateVariantAttributes == 0) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            status: false,
            msg: "variant attribute is not updated"
        })
    }

    return res.status(StatusCodes.ACCEPTED).send({
        status: true,
        msg: "variant attribute has been updated"
    })
}

editSubProduct = async (req, res) => {
    const { name, bodyHtml, slug, price, data } = req.body



    const UpdateSubProduct = await SubProduct.update({
        name: name,
        bodyHtml: bodyHtml,
        slug: slug,
        price: price,
        data: JSON.stringify(data)
    }, {
        where: {
            id: req.params.subProductId,
        }
    })

    if (UpdateSubProduct == 0) {
        return res.send({
            status: false,
            msg: "subProduct is not updated"
        })
    }
    return res.send({
        status: true,
        msg: "subProduct is Updated"
    })
}

addSubProductImage = async (req, res) => {
    const subProductId = req.params.subproductId;

    // const subProduct = await SubProduct.findOne({
    //     where: {
    //         id: subProductId
    //     },
    //     attributes:['id','productId'],
    //     include: {
    //         model: productImages,
    //         as: 'productImage',
    //         order: [['id', 'DESC']]
    //     }
    // })

    // we are finding last product image for postion in desc order
    const subProductQuery = 'SELECT subproducts.id,productimages.position,productimages.id as productImageId  FROM `subproducts` LEFT JOIN `productimages` ON subproducts.id = productimages.subProductId WHERE subproducts.id =' + subProductId + ' ORDER by productImageId DESC LIMIT 1;'

    const subProduct = await db.sequelize.query(subProductQuery, { type: db.sequelize.QueryTypes.SELECT })

    const subProductImage = await productImages.create({
        productId: subProduct[0].productId,
        subProductId: subProductId,
        src: req.body.src,
        alt: req.body.alt,
        position: subProduct[0].position + 1,
    })

    return res.send({
        status: true,
        msg: 'image is added'
    })
}

editSubProductTotalQuantity = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const action = req.body.action == "subtract" ? '-' : '+'
        const query = `UPDATE subproducts SET totalQuantity = totalQuantity ${action} :quantity WHERE id = :subProductId;`
        const subProductUpdateQuantity = await sequelize.query(query,
            {
                replacements: {
                    quantity: req.body.quantity,
                    subProductId: req.params.subProductId
                },
                type: sequelize.QueryTypes.UPDATE,
                transaction: t

            })

        // line error
        const createWarehousestockHistory = await WarehouseStockHistory.create({
            subProductId: req.params.subProductId,
            warehouseId: req.body.warehouseId,
            quantity: req.body.quantity,
            actionType: req.body.action,
        }, { transaction: t })

        await t.commit();

        res.send({
            status: true,
            msg: 'subProduct quantity has been updated'
        })
    } catch (error) {
        console.log(error)
        console.log('case 2')
        await t.rollback();
        res.status(400).json({ error: req.__('SERVER_ISSUE') });
    }
}
module.exports = {
    addProduct,
    getProductDetail,
    addVariantAttribute,
    productList,
    editProduct,
    editProductVariants,
    editVariantAttribute,
    editSubProduct,
    addSubProductImage,
    editSubProductTotalQuantity
}