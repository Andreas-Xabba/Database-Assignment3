const express = require('express')
const router = express.Router()
const controller = require('../controllers/mainController.js')
const routerExports = {}
module.exports = routerExports

routerExports.router = router
router.get('/', controller.renderOrders)

router.get('/create', controller.renderCreateOrder)
router.post('/create', controller.tryCreateOrder)

router.get('/view', controller.renderViewOrder)
router.get('/view/item/:id', controller.renderViewOrderItem)
router.post('/view/item/:id', controller.tryOrderItemChange)
