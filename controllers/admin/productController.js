addProduct =  (req,res)=>{
    
    // console.log(req.body)
    return res.send({"data": req.body});
}

module.exports = {
    addProduct
}