const { body } = require("express-validator")
const {pilot} = require('@models')

PilotLoginValidationRules = [
body('email').isEmail().withMessage("email must be string")
.custom(async(email)=>{
    const checkPilot = await pilot.count({
        where:{
            email:email
        }
    })

    if(checkPilot == 0){
        throw new Error('pilot does Not exist !!! ')
    }
    
    return true;
}),
body('password').isString().withMessage('password must be in string')
]

module.exports ={
    PilotLoginValidationRules
}