const { body, param } = require('express-validator');
const { Coupon, Product, Category } = require('@models');
const { Op } = require('sequelize');

const addCouponValidationRules = [
    body('name').isString().withMessage('name must be string'),
    body('code').isString().withMessage('code must be string')
        .custom(async (code) => {

            const checkCoupon = await Coupon.count({
                where: {
                    code: code
                }
            })

            if (checkCoupon != 0) throw new Error("Coupon already exist")
            return true
        }),
    body('type').isIn(['all', 'product', 'category']).withMessage('type must be product or category'),
    body('discountType').isIn(['fix', 'percent']).withMessage('discount must be fix or percent'),
    body('discountValue').isInt({ min: 1 }).withMessage('discountValue must be integer or not be less then 1')
        .custom((discountValue, { req }) => {
            if ((req.body.discountType == "percent") && (discountValue > 100)) {
                throw new Error('discounValue must be less then 100')
            } else if ((req.body.discountType == "fix") && (discountValue > req.body.minAmount)) {
                throw new Error('discount must be less then minAmount')
            } else if (discountValue > req.body.maxDiscount) {
                throw new Error('discount not be grater then maxDiscount')
            }
            return true
        }),
    body('maxDiscount').isInt({ min: 1 }).withMessage('maxDiscount must be in integer or not be less then 1'),
    body('termAndCondition').isString().withMessage('terms and conditions must be string'),
    body("image").isString().withMessage().withMessage('image must be string'),
    body('couponTypeRefId').isArray().withMessage('couponTypeRefId must be array')
        .custom(async (couponTypeRefId, { req }) => {

            if (req.body.type == "product") {
                const checkProduct = await Product.count({
                    where: {
                        id: couponTypeRefId
                    }
                })
                console.log(checkProduct, couponTypeRefId.length)

                if (checkProduct != couponTypeRefId.length) throw new Error('product not found')

            } else if (req.body.type == "category") {
                const checkCategory = await Category.count({
                    where: {
                        id: couponTypeRefId
                    }
                })

                if (checkCategory !== couponTypeRefId.length) throw new Error('Category not found')
            }
            return true
        }),

]

const editCouponValidationRules = [
    param('couponId').toInt().isInt().withMessage('couponId must be integer')
        .custom(async (couponId) => {
            const checkCoupon = await Coupon.count({
                id: couponId,
            })
            if (checkCoupon == 0) throw new Error("coupon not found you can't edit it")
        }),

    body('name').isString().withMessage('name must be string'),
    body('code').isString().withMessage('code must be string')
        .custom(async (code, { req }) => {

            const checkCoupon = await Coupon.count({
                where: {
                    id: {
                        [Op.not]: req.params.couponId
                    },
                    code: code
                }
            })
            if (checkCoupon != 0) throw new Error("Coupon already exist")
            return true
        }),
    body('type').isIn(['all', 'product', 'category']).withMessage('type must be product or category'),
    body('discountType').isIn(['fix', 'percent']).withMessage('discount must be fix or percent'),
    body('discountValue').isInt({ min: 1 }).withMessage('discountValue must be integer or not be less then 1')
        .custom((discountValue, { req }) => {
            if ((req.body.discountType == "percent") && (discountValue > 100)) {
                throw new Error('discounValue must be less then 100')
            } else if ((req.body.discountType == "fix") && (discountValue > req.body.minAmount)) {
                throw new Error('discount must be less then minAmount')
            } else if (discountValue > req.body.maxDiscount) {
                throw new Error('discount not be grater then maxDiscount')
            }
            return true
        }),
    body('maxDiscount').isInt({ min: 1 }).withMessage('maxDiscount must be in integer or not be less then 1'),
    body('termAndCondition').isString().withMessage('terms and conditions must be string'),
    body("image").isString().withMessage().withMessage('image must be string'),
    body('couponTypeRefId').isArray().withMessage('couponTypeRefId must be array')

]

const deleteCouponValidationRules = [
    param('couponId').isInt().withMessage('couponId must be integer')
        .custom(async (couponId) => {

            const checkCoupon = await Coupon.count({
                where: {
                    id: couponId,
                    deletedAt: null
                }
            })

            if (checkCoupon == 0) throw new Error("coupon may be already deleted or not exist")
            return true
        })
]

module.exports = {
    addCouponValidationRules,
    editCouponValidationRules,
    deleteCouponValidationRules,
}