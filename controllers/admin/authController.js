const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const moment = require('moment');

const { Admin } = require('@models');
const { personalAccessToken } = require('@models');

login = async (req,res)=>{
    try{
        const {email,password} = req.body

        // check email already exist ?
        const checkAdmin = await Admin.findOne({
            where:{
                email:email
            },
            attributes:[
                'id','email','name','password'
            ]
        }); 
        if(checkAdmin){
            // encrypt password
            hashResult = await bcrypt.compare(password, checkAdmin.password);
            if(hashResult){
                let tokenExp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365)
                // token valid for 1 year
                let token = jwt.sign({
                    adminId: checkAdmin.id,
                    exp: tokenExp,
                }, 
                    process.env.JWT_SECRET_KEY
                );

                // token store in personalaccesstoken
                let createPersonalAccessToken = await personalAccessToken.create({
                    tokenableType:'Admin',
                    tokenableId:checkAdmin.id , 
                    name:'mytoken',
                    token:token,
                    expiresAt:moment(new Date(tokenExp*1000)).format('YYYY-MM-DD HH:mm:ss')
                })

                res.status(200).json({
                    status:true,
                    admin:checkAdmin,
                    token:createPersonalAccessToken.id +'|'+token,
                })
            }else{
                res.status(400).json({error:req.__('WRONG_PASSWORD')})
            }
            
        }else{
            res.status(400).json({error:req.__('USER_NOT_EXIST')});
        }
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    login
}