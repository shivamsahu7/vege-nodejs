const router = require('express').Router()
const fileupload = require('express-fileupload')

const adminMiddleware = require('@middlewares/adminAuthMiddleware.js')
const authController = require('@controllers/admin/authController.js')
const wareHouseController = require('@controllers/admin/wareHouseController.js')

const categoryController = require('@controllers/admin/categoryController.js')
const subCategoryController = require('@controllers/admin/subCategoryController.js')
const productController = require('@controllers/admin/productController.js')

const handleValidationErrors = require('@requests/handleValidationErrors.js')

const { loginAdminValidationRules } = require('@requests/admin/loginValidation.js');

const { addCategoryValidationRules, addSubCategoryValidationRules, updateCategoryValidationRules, updateSubCategoryValidationRules } = require('@requests/admin/categoryValidation.js');
const { addProductValidationRules, editProductValidationRules , editVariantAttributeValidationRules , editSubProductValidationRules} = require('@requests/admin/productValidation.js')

const { addWareHouseValidationRules, updateWareHouseValidationRules, deleteWareHouseValidationRules } = require('@requests/admin/wareHousevalidation.js')

router.post(
    '/login',
    loginAdminValidationRules,
    handleValidationErrors,
    authController.login
)

router.use("/", adminMiddleware);

router.get('/list-category', categoryController.categoryList)

router.post(
    '/add-category',
    fileupload({
        useTempFiles: true,
        tempFileDir: 'public'
    }),
    addCategoryValidationRules,
    handleValidationErrors,
    categoryController.addCategory
)

router.post(
    '/update-category/:id',
    fileupload({
        useTempFiles: true,
        tempFileDir: 'public'
    }),
    updateCategoryValidationRules,
    handleValidationErrors,
    categoryController.updateCategory
)

router.post('/delete-category/:id', categoryController.deleteCategory)

router.post(

    '/add-subcategory',
    fileupload({
        useTempFiles: true,
        tempFileDir: 'public'
    }),

    addSubCategoryValidationRules,
    handleValidationErrors,
    subCategoryController.addSubCategory
)

router.post(

    '/update-subcategory/:id',
    fileupload({
        useTempFiles: true,
        tempFileDir: 'public'
    }),

    updateSubCategoryValidationRules,
    handleValidationErrors,
    subCategoryController.updateSubCategory
)

router.post('/delete-subcategory/:id', subCategoryController.deleteSubCategory)

router.post(
    '/add-warehouse',
    addWareHouseValidationRules,
    handleValidationErrors,
    wareHouseController.createWareHouse,
)

router.post(
    '/update-warehouse/:id',
    updateWareHouseValidationRules,
    handleValidationErrors,
    wareHouseController.updateWareHouse,
)

router.delete(
    '/delete-warehouse/:id',
    deleteWareHouseValidationRules,
    handleValidationErrors,
    wareHouseController.deleteWareHouse,
)

router.post(
    '/add-product',
    fileupload({
        useTempFiles: true,
        tempFileDir: 'public'
    }),
    addProductValidationRules,
    handleValidationErrors,
    productController.addProduct
);

router.get("/detail-product/:id", productController.getProductDetail);
router.get("/list-product", productController.productList);

router.put(
    "/edit-product/:id",
    editProductValidationRules,
    handleValidationErrors,
    productController.editProduct
);

router.put(
    "/edit-product-Variant/:variantId",
    editProductVariantValidationRules,
    handleValidationErrors,
    productController.editProductVariants,
);

router.put(
    "/edit-product-Variant-attribute/:attributeId",
    editVariantAttributeValidationRules,
    handleValidationErrors,
    productController.editVariantAttribute,
);

router.put(
    "/edit-subProduct/:subProductId",
    editSubProductValidationRules,
    handleValidationErrors,
    productController.editSubProduct,
);





module.exports = router
