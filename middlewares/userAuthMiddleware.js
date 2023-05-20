var jwt = require('jsonwebtoken');
const moment = require('moment');
const { User,personalAccessToken } = require('../models');

module.exports = async (req,res,next)=>{
    let token;
    try{
        const temp = req.headers.authorization
        token = temp.split(" ")[1]

    }catch(err){
        console.log(err)
        return res.status(401).json({
            status:false,
            error:req.__('UNAUTHORIZE')
        })
    }

    try{
        splittedToken = token.split("|")
        const checkPersonalAccessToken = await personalAccessToken.findOne({
            where:{
                id:splittedToken[0]
            }
        })
        // check record in db
        if(!checkPersonalAccessToken){
            return res.status(401).json({
                status:false,
                error:req.__('UNAUTHORIZE')
            })
        }
        // check token type
        if(checkPersonalAccessToken.tokenableType != "User"){
            return res.status(400).json({
                status:false,
                error:req.__('NOT_USER')
            });
        }

    }catch(err){
        console.log(err)
        return res.status(401).json({
            status:false,
            error:req.__('UNAUTHORIZE')
        })
    }

    try{
        const data = jwt.verify(splittedToken[1],process.env.JWT_SECRET_KEY)
        // check email already exist ?
        const checkUser = await User.findOne({
            where:{
                id:data.userId
            },
            attributes:[
                'id','email','name'
            ]
        }); 
        if(checkUser){
            req.user = await checkUser
            next()
        }else{
            return res.status(401).json({
                status:false,
                error:req.__('UNAUTHORIZE')
            })
        }
    }catch(err){
        console.log(err)
        return res.status(401).json({
            status:false,
            error:req.__('UNAUTHORIZE')
        })
    }
}