const express = require('express')
const app = express();
const httpServer = require('http').createServer(app);
// const io = require('socket.io')(httpServer);
require('./websocket/pilotSocket.js').getIo(httpServer);
const pilotCron = require('./cron/pilotCron.js') 

const cors = require('cors')
const logger = require('./config/logger.js')
const i18n = require('./config/i18n.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./doc/swagger.json');
const swaggerAdminDocument = require('./doc/swagger-admin.json')
const corsOptions = require('./config/cors.js')


require('dotenv').config()
require('module-alias/register');

// insert log
// app.use((req,res,next)=>{
//     let oldSend = res.send
//     res.send = function(data){
//         oldSend.apply(res,arguments)
//         logger.info({req:req.body,res:JSON.parse(data)})
//     }
//     next()
// })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors allow
app.use(cors(corsOptions))

// localization for multiple language
app.use(i18n.init); 

app.use(express.static('public'));

// api routes
app.use("/api",require('@routes/apiRoutes.js'))


// admin routes
app.use("/admin",require('@routes/adminRoutes.js'))

//pilot routes
app.use("/pilot",require('@routes/pilotRoutes.js'))

// api documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/admin-docs', swaggerUi.serve, swaggerUi.setup(swaggerAdminDocument))

// server listen 3000 port
httpServer.listen(process.env.APP_PORT,()=>{
    console.log(`server listening port http://localhost:${process.env.APP_PORT}`)
})
