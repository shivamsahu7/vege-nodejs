const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const moment = require('moment');

const { User } = require('./../models');
const { personalAccessToken } = require('./../models');

login = async (req,res)=>{
    try{
        const {name,email,password} = req.body

        // check email already exist ?
        const checkUser = await User.findOne({
            where:{
                email:email
            },
            attributes:[
                'id','email','name','password'
            ]
        }); 
        if(checkUser){
            // encrypt password
            hashResult = await bcrypt.compare(password, checkUser.password);
            if(hashResult){
                let tokenExp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365)
                // token valid for 1 year
                let token = jwt.sign({
                    userId: checkUser.id,
                    exp: tokenExp,
                }, 
                    process.env.JWT_SECRET_KEY
                );

                // token store in personalaccesstoken
                let createPersonalAccessToken = await personalAccessToken.create({
                    tokenableType:'User',
                    tokenableId:checkUser.id,
                    name:'mytoken',
                    token:token,
                    expiresAt:moment(new Date(tokenExp*1000)).format('YYYY-MM-DD HH:mm:ss')
                })

                res.status(200).json({
                    status:true,
                    user:checkUser,
                    token:createPersonalAccessToken.id +'|'+token,
                })
            }else{
                res.status(400).send({"err":"Wrong Password"})
            }

        }else{
            res.status(400).json({error:"user does not exist"});
        }
    }catch(error){
        console.log(error)
    }
}

register = async (req,res)=>{
    try{
        const {name,email,password} = req.body
        // check email already exist ?
        const checkUser = await User.findOne({
            where:{
                email:email
            },
            attributes:[
                'email','name'
            ]
        }); 
        if(checkUser){
            res.status(400).json({error:"user exist"});
        }else{
            // encrypt password
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            let newUser = await User.create({
                name:name,
                email:email,
                password:hash
            })
            res.status(200).json({user:newUser});
        }
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    login,register
}