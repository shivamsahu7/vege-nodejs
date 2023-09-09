const { body, param } = require('express-validator');
const { Permission, Admin, userPermission } = require('@models');
const { error } = require('winston');
const { Op } = require('sequelize');


addPermissionHandleValidationRules = [
    body('slug').isString().withMessage('slug must be string')
        .custom(async (slug) => {
            const isSlugExist = await Permission.count({
                where: {
                    slug: slug
                }
            })

            if (isSlugExist > 0) throw Error("slug permission alrady exist")
            return true
        }),

    body('name').isString().withMessage('name must be string'),
];

addAssignPermissionHandleValidationRules = [
    body('adminId').isInt().withMessage('admin Id must be integer')
        .custom(async (adminId) => {
            const checkAdmin = await Admin.findOne({
                where: {
                    id: adminId
                },
                attributes: ['type']
            })
            console.log(checkAdmin.dataValues.type)
            if (checkAdmin.dataValues) {
                if (checkAdmin.dataValues.type == "admin") {
                    throw new Error("assign permission to the admin not allowed");
                }
            } else {
                throw new Error("admin is not exist");
            }

            return true
        }),
    body('permissionId').isArray().withMessage('permission Id must be Array')
        .custom(async (permissionIds, { req }) => {

            const checkPermission = await Permission.count({
                where: {
                    id: permissionIds
                }
            })

            if (checkPermission != permissionIds.length) throw new Error("Invalid Permission ")

            return true
        })
]

editPermissionHandleValidationRules = [

    param('id').isInt().withMessage("id must be integer")
        .custom(async (id) => {
            const checkPermission = await Permission.count({
                where: {
                    id: id
                }
            });
            if (checkPermission != 1) throw Error('no permission exist');
            return true
        }),

    body('slug').isString().withMessage("Slug Must Be String")
        .custom(async (slug, { req }) => {

            const checkSlug = await Permission.count({
                where: {
                    id: {
                        [Op.not]: req.params.id
                    },
                    slug: slug
                }
            })

            if (checkSlug == 1) throw Error('slug alread exist');
            return true
        }),
    body('name').isString({ min: 1 }).withMessage("must be string")
]

module.exports = {
    addPermissionHandleValidationRules,
    addAssignPermissionHandleValidationRules,
    editPermissionHandleValidationRules
}