const { Permission, userPermission, sequelize, Sequelize } = require('@models');
const db = require("@models")
const { StatusCodes } = require('http-status-codes');
const { errorMonitor } = require('nodemailer/lib/xoauth2');
const { query } = require('express');

//add permission
addPermission = async (req, res) => {
    try {
        const { slug, name } = req.body;

        const addPermission = await Permission.create({
            slug: slug,
            name: name
        })


        return res.status(StatusCodes.ACCEPTED).send({
            status: true,
            msg: "permission has been created"
        })

    } catch (error) {

        return res.status(StatusCodes.BAD_REQUEST).send({
            status: true,
            msg: "permission has been not created something went wrong"
        })
        console.log(error)
    }
}

addUserPermission = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const { adminId, permissionId } = req.body
        let query = "select permissionId from userpermissions where adminId = :adminId"
        const permissionData = await sequelize.query(
            query, {
            replacements: {
                adminId: adminId
            },
            type: Sequelize.QueryTypes.SELECT,
        })
        const permissionIdDB = permissionData.map(value => value.permissionId);

        const addPermission = permissionId.filter(value => !permissionIdDB.includes(value));
        const removePermission = permissionIdDB.filter(value => !permissionId.includes(value));
        console.log("add", addPermission, "remove", removePermission)

        let addQuery = "";
        let removeQuery = "";

        if (addPermission.length > 0) {
            addQuery += `INSERT INTO userpermissions(adminId ,permissionId) VALUES`
            addPermission.forEach((addValue, index) => {
                addQuery += `(${adminId}, ${addValue})`
                if ((addPermission.length - 1) != index) {
                    addQuery += ","
                }
            });
            addQuery += ";"
        }

        if (removePermission.length > 0) {
            removeQuery += `DELETE FROM userpermissions WHERE adminId IN (`
            removePermission.forEach((remValue, index) => {
                removeQuery += `${remValue}`
                if ((removePermission.length - 1) != index) {
                    removeQuery += ","
                }
            })
            removeQuery += ");"
        }

        if (addQuery != "") {
            const result = await db.sequelize.query(addQuery, { transaction: t })
        }

        if (removeQuery != "") {
            const result = await db.sequelize.query(removeQuery, { transaction: t })
        }
        await t.commit();
        return res.status(StatusCodes.ACCEPTED).send({
            status: true,
            msg: "user permission has been created"
        })

    } catch (error) {
        await t.rollback()
        console.log(error)
        return res.status(StatusCodes.BAD_REQUEST).send({
            status: true,
            msg: "user permission not created something went wrong"
        })
    }
}

//edit permission
editPermission = async (req, res) => {
    try {
        const { name, slug } = req.body;

        const updatePermission = await Permission.update({
            name: name,
            slug: slug
        }, {
            where: {
                id: req.params.id
            }
        });


        return res.status(StatusCodes.ACCEPTED).send({
            status: true,
            msg: "permissions are edited successfuly"
        })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.BAD_REQUEST).send({
            status: false,
            msg: "something went wrong"
        })
    }
}

module.exports = {
    addPermission,
    addUserPermission,
    editPermission
}