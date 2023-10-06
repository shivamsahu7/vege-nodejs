const express = require('express')
const pilotController = require('@controllers/api/pilotController.js');
const handleValidationError = require('../requests/handleValidationErrors.js')
const PilotValidationRules = require('../requests/api/pilotValidation.js')
const pilotAuthMiddleware = require('@middlewares/pilotAuthMiddleware.js')
const path = require('path')
// const file = require("../public/files/pilot.html")
const router = express.Router();

router.get('/pilotFile',(req , res)=>{
    const currentPath = `${__dirname}/../public/files/pilot`
    const resolvePath =path.resolve(currentPath)
    return res.sendFile("pilotSocket.html",{root:resolvePath})
})

router.post('/login-pilot',
PilotValidationRules.PilotLoginValidationRules,
handleValidationError,
pilotController.loginPilot,
);

router.use('/', pilotAuthMiddleware);



module.exports = router