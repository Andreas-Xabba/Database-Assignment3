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
router.get('/view/part/:partNumber', controller.renderPart)
router.post('/view/part/:partNumber', controller.updatePart)
router.get('/view/location/:locationNumber', controller.renderLocation)
router.post('/view/location/:locationNumber', controller.updateLocation)

router.get('/addlocation', controller.renderAddLocation)
router.post('/addlocation', controller.tryAddLocation)
