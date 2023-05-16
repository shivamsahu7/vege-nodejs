const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const moment = require('moment');

const { User,personalAccessToken,PasswordResetToen } = require('../../models');

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
                res.status(400).send({"err":req.__('WRONG_PASSWORD')})
            }

        }else{
            res.status(400).json({error:req.__('USER_NOT_EXIST')});
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
            res.status(400).json({error:req.__('USER_EXIST')});
        }else{
            // encrypt password
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            let newUser = await User.create({
                name:name,
                email:email,
                password:hash
            })
            res.status(200).json({
                status:true,
                user:newUser
            });
        }
    }catch(error){
        console.log(error)
    }
}

forgotPassword = async (req,res)=>{
    try{
        const {email} = req.body
        const checkUser = await User.findOne({
            where:{
                email:email
            },
            attributes:['email','password']
        })
        // check user exist in users table
        if(!checkUser){
            res.status(400).json({error:req.__('USER_NOT_EXIST')});
        }

        // generate jwt token for forgot password
        let token = jwt.sign(
            {
                userId: checkUser.id,
                email: checkUser.email,
            }, 
            process.env.JWT_SECRET_KEY,
            {
                expiresIn:'15m'
            }
        );
        // check user previous record in password reset token table
        let existPasswordResetToen = await PasswordResetToen.findOne({
            where:{
                email:email
            }
        })
        // if record exist delete previous record
        if(existPasswordResetToen ){
            await existPasswordResetToen.destroy({
                email: email
            });
        }

        let newPasswordResetToen = await PasswordResetToen.create({
            email:email,
            token:token
        })

        const link = `${process.env.WEB_URL}/reset-password/${checkUser.email}/${token}`

        res.status(200).json({
            status:true,
            msg:req.__("EMAIL_SENT"),
            link:link
        })
    }catch(err){
        console.log(err)
    }
}

resetPassword = async(req,res)=>{
    try{
        const {email,token,password} = req.body
        let existPasswordResetToken = await PasswordResetToen.findOne({
            where:{
                email:email
            }
        })
        if(token != existPasswordResetToken.token){
            return res.status(400).json({error:req.__('TOKEN_NOT_VALID')});
        }
        // after verified token delete
        await existPasswordResetToken.destroy()

        const data = jwt.verify(token,process.env.JWT_SECRET_KEY)
        // return res.json(data)
        const checkUser = await User.findOne({
            where:{
                email:data.email
            }
        }); 

        if(checkUser){
            // encrypt password
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            await checkUser.update({
                password: hash,
            });

            res.status(200).json({
                status:true,
                "msg":req.__('PASSWORD_CHANGED')
            });
        }else{
            return res.status(400).json({error:req.__('USER_NOT_EXIST')});
        }
    }catch(err){
        console.log(err)
        res.status(400).json({status:false,msg:req.__('SERVER_ISSUE')});
    }
}

module.exports = {
    login,register,forgotPassword,resetPassword
}