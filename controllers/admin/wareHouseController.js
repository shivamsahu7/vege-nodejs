const { WareHouse } = require("@models")
const path = require('path');
const { StatusCodes } = require('http-status-codes');
const { SubCategory } = require('@models');
const fs = require("fs");
const { check } = require('express-validator');

ListWareHouse = async(req , res)=>{
    let DataList = await WareHouse.findAll({
       
    })
}

createWareHouse = async (req, res) => {

    // return res.send({res:"case1"})
    let { name, state, city, lat, lng } = req.body
    let checkWareHouse = await WareHouse.findAll({
        where: {
            name: name,
            state: state,
            city: city,
            lat: lat,
            lng: lng,
        }
    })
    if (!checkWareHouse) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: false,
            msg: req.__('WEREHOUSE_EXIST'),
        });
    }

    let createWareHouse = await WareHouse.create({
        name: name,
        state: state,
        city: city,
        lat: lat,
        lng: lng,
        status: false
    })

    return res.status(StatusCodes.CREATED).json({
        status: true,
        msg: req.__('WEREHOUSE_ADD'),
        subCategory: createWareHouse
    });

}

updateWareHouse = async (req, res) => {

    let { id } = req.params
    let { name, state, city, lat, lng, status } = req.body

    let checkWareHouse = await WareHouse.findOne({
        where: {
            Id: id
        }
    })

    if (name) {
        checkWareHouse.name = name
    }
    if (state) {
        checkWareHouse.state = state
    }
    if (city) {
        checkWareHouse.city = city
    }
    if (lat) {
        checkWareHouse.lat = lat
    }
    if (lng) {
        checkWareHouse.lng = lng
    }
    if (status) {
        checkWareHouse.status = status
    }

    checkWareHouse.save()
    return res.send({ r: checkWareHouse })
}

module.exports = {
    createWareHouse,
    updateWareHouse
} 