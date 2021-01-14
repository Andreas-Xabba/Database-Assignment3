const express = require('express')
const router = express.Router()
const controller = require('../controllers/mainController.js')
const routerExports = {}
module.exports = routerExports

routerExports.router = router
router.get('/', controller.renderModels)

router.get('/create', controller.renderCreateModel)

router.get('/view', controller.renderViewModel)
