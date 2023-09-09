const { StatusCodes } = require('http-status-codes')
const { Coupon, CouponDetail } = require('@models')
const { sequelize } = require('@models')
const {newCurrentMysqlDate} = require('../../helper/dateHelper.js')


addCoupon = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, code, type, discountType, discountValue, minAmount, maxDiscount, termAndCondition, image, couponTypeRefId } = req.body

        const createCoupon = await Coupon.create({
            name: name,
            code: code,
            type: type,
            discountType: discountType,
            discountValue: discountValue,
            minAmount: minAmount,
            maxDiscount: maxDiscount,
            termAndCondition: termAndCondition,
            image: image,
        }, { transaction: t })

        const couponDetail = []
        couponTypeRefId.forEach(refId => {
            couponDetail.push({
                couponId: createCoupon.id,
                couponTypeRefId: refId
            })
        }, { transaction: t });

        const createCouponDetail = await CouponDetail.bulkCreate(couponDetail)

        t.commit()
        res.status(StatusCodes.ACCEPTED).send({
            status: true,
            msg: 'coupon is created'
        })

    } catch (error) {
        t.rollback()
        res.status(StatusCodes.BAD_REQUEST).send({
            status: false,
            msg: error
        })
    }
}

editCoupon = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, code, type, discountType, discountValue, minAmount, maxDiscount, termAndCondition, image, couponTypeRefId } = req.body
        const updateCoupon = await Coupon.update({
            name: name,
            code: code,
            type: type,
            discountType: discountType,
            discountValue: discountValue,
            minAmount: minAmount,
            maxDiscount: maxDiscount,
            termAndCondition: termAndCondition,
            image: image,
        }, {
            where: {
                id: req.params.couponId
            },
            transaction: t
        })

        const checkCouponDetail = await CouponDetail.findAll({
            where: {
                couponId: req.params.couponId,
            },
            attributes: ['couponTypeRefId']
        })

        const checkCouponRefIds = checkCouponDetail.map(couponDetail => couponDetail.couponTypeRefId) // dbRefId

        const refIds = req.body.couponTypeRefId // payload
        console.log('payload', refIds)
        const addValues = refIds.filter(value => !checkCouponRefIds.includes(value));

        console.log('addvalue', addValues)
        const removeValues = checkCouponRefIds.filter(value => !refIds.includes(value))
        console.log('removeValues', removeValues)
        // how many ids does not exist in db


        if(addValues.length > 0){

            const addCouponDetail = addValues.map((value) => {
                return ({
                    couponId: req.params.couponId,
                    couponTypeRefId: value,
                })
            })

            const updateCoupons = await CouponDetail.bulkCreate(addCouponDetail)
            console.log(addCouponDetail)
        }

        if (removeValues.length > 0) {
            const deleteCoupons = await CouponDetail.destroy({
                where: {
                    couponId: req.params.couponId,
                    couponTypeRefId: removeValues
                }
            })
        }

        t.commit()

        res.status(StatusCodes.ACCEPTED).send({
            status: true,
            msg: 'coupon is updated'
        })

    } catch (error) {
        console.log(error)
        t.rollback()
        res.status(StatusCodes.BAD_REQUEST).send({
            status: false,
            msg: error
        })
    }
}

deleteCoupon = async (req, res) => {
    try {
        console.log(req.params.couponId)
        
        const deleteCoupon =  Coupon.update({
            deletedAt: newCurrentMysqlDate()
        }, {
            where: {
                id: req.params.couponId
            }
        })

        let response = await Promise.all([deleteCoupon])
        console.log(response)
        return res.status(StatusCodes.ACCEPTED).send({
            status: true,
            msg: "Coupon deleted"
        })
    } catch (error) {
        console.log(error)
    }

}



module.exports = {
    addCoupon,
    editCoupon,
    deleteCoupon
}