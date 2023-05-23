var jwt = require('jsonwebtoken');
const moment = require('moment');
const { Admin,personalAccessToken } = require('@models');

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
        if(checkPersonalAccessToken.tokenableType != "Admin"){
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
        const checkAdmin = await Admin.findOne({
            where:{
                id:data.adminId
            },
            attributes:[
                'id','email','name'
            ]
        }); 
        if(checkAdmin){
            req.admin = await checkAdmin
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