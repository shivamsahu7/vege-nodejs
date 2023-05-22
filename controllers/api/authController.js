const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const moment = require('moment');
var passwordGenerator = require('generate-otp')

const forgotPasswordMail = require('@mail/forgotPasswordMail.js')

const { User,personalAccessToken,PasswordResetToen,OtpVerify } = require('@models');

login = async (req,res)=>{
    try{
        const {email,password} = req.body

        // check email already exist ?
        const checkUser = await User.scope('userVerified').findOne({
            where:{
                email:email,
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

                return res.status(200).json({
                    status:true,
                    msg:req.__('LOGIN_MSG'),
                    user:checkUser,
                    token:createPersonalAccessToken.id +'|'+token,
                })
            }else{
                return res.status(400).json({
                    status:false,
                    error:req.__('WRONG_PASSWORD')
                })
            }

        }else{
            return res.status(400).json({
                status:false,
                error:req.__('USER_NOT_EXIST')
            });
        }
    }catch(error){
        console.log(error)
        return res.status(400).json({
            status:false,
            error:req.__('SERVER_ISSUE')
        });
    }
}

register = async (req,res)=>{
    try{
        const {name,email,password} = req.body
        // check email already exist ?
        let checkUser = await User.findOne({
            where:{
                email:email
            },
            attributes:[
                'id','email','name','emailVerifiedAt'
            ]
        }); 
        // encrypt password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // user exist 
        if(checkUser){
            // user verified
            if(checkUser.emailVerifiedAt != null){
                return res.status(400).json({
                    status:false,
                    error:req.__('USER_EXIST')
                });
            }
            // user did not verify
            else{
                await checkUser.update({
                    name:name,
                    email:email,
                    password:hash
                })
                await OtpVerify.destroy({
                    where:{
                        otpType:'User',
                        otpId:checkUser.id
                    }
                })
            }
        }
        else{
            // new user create
            checkUser = await User.create({
                name:name,
                email:email,
                password:hash
            })
        }

        // random otp generate
        let randomOtp  = passwordGenerator.generate(5);

        let newOtpVerify = await OtpVerify.create({
            otpType:'User',
            otpId:checkUser.id,
            otp:randomOtp
        })

        return res.status(200).json({
            status:true,
            msg:req.__('REGISTER_MSG'),
            otp:randomOtp,
            user:checkUser
        });
    }catch(error){
        console.log(error)
        return res.status(400).json({
            status:false,
            error:req.__('SERVER_ISSUE')
        });
    }
}

otpVerify = async (req,res)=>{
    try{
        const {otp,email} = req.body
        // check email already exist ?
        const checkUser = await User.findOne({
            where:{
                email:email,
                emailVerifiedAt:null
            },
            attributes:[
                'id','email','emailVerifiedAt'
            ]
        }); 
        // return res.send({checkUser})
        if(checkUser){
            let checkOtpVerify = await OtpVerify.findOne({
                where:{
                    otpId:checkUser.id,
                    otpType:'User'
                },
                attributes:[
                    'id','otp','createdAt'
                ]
            })
            
            if(checkOtpVerify && (checkOtpVerify.otp == otp)){
                // check token is not expired
                const currentTime = new Date();
                // Add 5 minutes in otp createdAt time
                const otpExpiredTimeAdd5Minute = new Date(checkOtpVerify.createdAt.getTime() + 5 * 60000);
                // compare current time with expired time
                if(currentTime >= otpExpiredTimeAdd5Minute){
                    await checkOtpVerify.destroy()
                    return res.status(400).json({
                        status:false,
                        error:req.__('OTP_EXPIRED')
                    });
                }

                // user insert verified at
                await checkUser.update({
                    emailVerifiedAt:new Date().toISOString().replace("T", " ").replace("Z", "")
                })

                await checkOtpVerify.destroy()

                return res.status(200).json({
                    status:true,
                    msg:req.__('REGISTER_MSG'),
                    user:checkUser
                });
            }else{
                return res.status(400).json({
                    status:false,
                    error:req.__('OTP_INVALID')
                });
            }
        }
        return res.status(400).json({
            status:false,
            error:req.__('USER_NOT_EXIST')
        });
    }catch(error){
        console.log(error)
        return res.status(400).json({
            status:false,
            error:req.__('SERVER_ISSUE')
        });
    }
}

forgotPassword = async (req,res)=>{
    try{
        const {email} = req.body
        const checkUser = await User.findOne({
            where:{
                email:email
            },
            attributes:['email','password','name']
        })
        // check user exist in users table
        if(!checkUser){
            return res.status(400).json({
                status:false,
                error:req.__('USER_NOT_EXIST')
            });
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

        forgotPasswordMail(email,{
            name: checkUser.name,
            message: 'This is the message content.',
            link:link
        })

        return res.status(200).json({
            status:true,
            msg:req.__("EMAIL_SENT"),
            link:link
        })
    }catch(err){
        console.log(err)
        return res.status(400).json({
            status:false,
            error:req.__('SERVER_ISSUE')
        });
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
            return res.status(400).json({
                status:false,
                error:req.__('TOKEN_NOT_VALID')
            });
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

            return res.status(200).json({
                status:true,
                "msg":req.__('PASSWORD_CHANGED')
            });
        }else{
            return res.status(400).json({
                status:false,
                error:req.__('USER_NOT_EXIST')
            });
        }
    }catch(err){
        console.log(err)
        return res.status(400).json({
            status:false,msg:req.__('SERVER_ISSUE')
        });
    }
}

module.exports = {
    login,register,otpVerify,forgotPassword,resetPassword
}