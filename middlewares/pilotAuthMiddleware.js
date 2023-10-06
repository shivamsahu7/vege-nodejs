const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken')
const {pilot} = require('@models');
const { ISO_8601 } = require('moment/moment');

module.exports = async (req, res , next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]

        if (!token) return (res.send({ status: false, msg: "pilot has been not Autherized" }));

         await jwt.verify(token, process.env.JWT_SECRET_KEY, async(error, decoded)=>{
            if(error) return (res.send({ status: false, msg: error }));
            if(decoded){
                req.pilot ={id: decoded.id , email: decoded.email }
                next();
            }
        })
        
    } catch (error) {
        console.log(error);
        if (error) return (res.status(StatusCodes.BAD_REQUEST).send({ status: false, msg: "autherization error" }));
    }
}