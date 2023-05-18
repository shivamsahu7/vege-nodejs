const express = require('express')
const cors = require('cors')
const logger = require('./config/logger.js')
const i18n = require('./config/i18n.js');
require('dotenv').config()
require('module-alias/register');

const app = express();

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    exposedHeaders: ['access_token']
}

// insert log
app.use((req,res,next)=>{
    // console.log(req.body)
    let oldSend = res.send
    res.send = function(data){
        oldSend.apply(res,arguments)
        logger.info({req:req.body,res:JSON.parse(data)})
    }
    next()
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors(corsOptions))
app.use(i18n.init);
app.use("/api",require('@routes/apiRoutes.js'))

app.listen(process.env.PORT,()=>{
    console.log(`server listening port http://localhost:${process.env.PORT}`)
})