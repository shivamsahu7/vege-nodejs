const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const  { pilot} = require('@models')


loginPilot =async(req, res)=>{
 const {email , password} = req.body;

 const findPilot = await pilot.findOne({
    where:{
        email:email
    }
 }) 
 const checkPassword =  await bcrypt.compare(password, findPilot.password);

if(!checkPassword) return(res.send({status:false, msg:'Wrong Password '})) 
if(!findPilot.emailVerifiedAt) return(res.send({status:false, msg:'email is not verified'})) 

const token = jwt.sign({id:findPilot.id,email:email},process.env.JWT_SECRET_KEY)

return res.send({status:true,token:token, msg:findPilot})
}







module.exports ={
    loginPilot
}