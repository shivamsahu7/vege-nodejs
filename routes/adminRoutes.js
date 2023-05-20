const router = require('express').Router()

const categoryController = require('@controllers/admin/categoryController.js')

router.post(
    'add-catgory',
    categoryController.addCategory
)

module.exports = router