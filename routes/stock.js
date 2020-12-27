const express = require('express')
const router = express.Router()
const controller = require('../controllers/mainController.js')
const routerExports = {}
module.exports = routerExports

routerExports.router = router
router.get('/', controller.renderStock)

router.get('/addpart', controller.renderAddPart)
router.post('/addpart', controller.tryAddPart)

router.get('/view', controller.renderViewStock)
