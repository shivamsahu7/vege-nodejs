const { personalAccessToken } = require('./../models');

profile = async (req,res)=>{
    res.status(200).json({user:req.user})
}

logout = async (req,res)=>{
    try{
        const temp = req.headers.authorization
        token = temp.split(" ")[1]
        splittedToken = token.split("|")
        const deletePersonalAccessToken = await personalAccessToken.destroy({
            where:{
                id:splittedToken[0]
            }
        })
        if(deletePersonalAccessToken){
            res.status(200).json({status:true})
        }else{
            res.status(400).json({error:"we are facing server issue2"});
        }
    }catch(err){
        console.log(err)
        res.status(400).json({error:"we are facing server issue"});
    }
}

module.exports = {
    profile,logout
}