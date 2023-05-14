var jwt = require('jsonwebtoken');
const moment = require('moment');
const { User } = require('../models');
const { personalAccessToken } = require('../models');

module.exports = async (req,res,next)=>{
    let token;
    try{
        const temp = req.headers.authorization
        token = temp.split(" ")[1]

    }catch(err){
        console.log(err)
        return res.status(401).json({'error':"Not Authenticated"})
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
            return res.status(400).json({error:"Not Authenticated 1.2"});
        }
        // check token type
        if(checkPersonalAccessToken.tokenableType != "User"){
            return res.status(400).json({error:"You are not a user"});
        }

    }catch(err){
        console.log(err)
        return res.status(401).json({'error':"Not Authenticated2"})
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
            return res.status(400).json({error:"Not Authenticated"});
        }
    }catch(err){
        console.log(err)
        return res.status(401).json({'error':"Not Authenticated3"})
    }
}