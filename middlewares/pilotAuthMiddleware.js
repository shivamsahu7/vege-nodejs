const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken')

module.exports = async (req, res , next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]

        if (!token) return (res.send({ status: false, msg: "pilot has been not Autherized" }));

         await jwt.verify(token, process.env.JWT_SECRET_KEY,(error, decoded)=>{
            if(error) return (res.send({ status: false, msg: error }));
            if(decoded) next()
        })

    } catch (error) {
        console.log(error);
        if (error) return (res.status(StatusCodes.BAD_REQUEST).send({ status: false, msg: "autherization error" }));
    }
}