const {  deliveryCharge } = require('@models');


addDeliveryCharge = async (req , res)=>{
    const {amount, charge} = req.body;
   
    const createDeliveryCharge = await deliveryCharge.create({
       amount:amount,
       charge:charge
    });
   
    return res.send({
       status:true,
       msg:"delivery created "
    })
   }

    module.exports ={
        addDeliveryCharge
    }