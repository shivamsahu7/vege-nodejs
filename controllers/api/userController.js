const { personalAccessToken } = require('@models');

profile = async (req,res)=>{
    try{
        return res.status(200).json({
            status:true,
            user:req.user,
        })
    }catch(err){
        console.log(err)
        return res.status(400).json({
            status:false,
            error:req.__('SERVER_ISSUE')
        });
    }
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
            return res.status(200).json({
                status:true,
                msg:req.__('LOGOUT_MSG')
            })
        }else{
            return res.status(400).json({
                status:false,
                error:req.__('TOKEN_NOT_VALID')
            });
        }
    }catch(err){
        console.log(err)
        return res.status(400).json({
            status:false,
            error:req.__('SERVER_ISSUE')
        });
    }
}

module.exports = {
    profile,logout
}