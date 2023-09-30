const express = require('express')
const pilotController = require('@controllers/api/pilotController.js');
const handleValidationError = require('../requests/handleValidationErrors.js')
const PilotValidationRules = require('../requests/api/pilotValidation.js')
const pilotAuthMiddleware = require('@middlewares/pilotAuthMiddleware.js')

const router = express.Router()

router.post('/login-pilot',
PilotValidationRules.PilotLoginValidationRules,
handleValidationError,
pilotController.loginPilot,
);

router.use('/', pilotAuthMiddleware)

module.exports = router