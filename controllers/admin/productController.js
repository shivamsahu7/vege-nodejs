addProduct = async(req,res)=>{
    res.send({"status":req.body.detail[0].id});
}

module.exports = {
    addProduct
}