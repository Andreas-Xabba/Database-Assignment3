const express = require('express')
const router = express.Router()
const controller = require('../controllers/mainController.js')
const routerExports = {}
module.exports = routerExports

routerExports.router = router
router.get('/', controller.renderOrders)

router.get('/create', controller.renderCreateOrder)

router.get('/view', controller.renderViewOrder)
