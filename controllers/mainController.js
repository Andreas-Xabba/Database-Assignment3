const controller = {}
module.exports = controller

controller.renderIndex = async (req, res) => { // eslint-disable-line
  res.render('index', { layout: 'main' })
}

controller.renderOrders = async (req, res) => { // eslint-disable-line
  res.render('orders', { layout: 'main' })
}

controller.renderStock = async (req, res) => { // eslint-disable-line
  res.render('stock', { layout: 'main' })
}

controller.renderCreateOrder = async (req, res) => { // eslint-disable-line
  res.render('createOrder', { layout: 'main' })
}

controller.renderViewOrder = async (req, res) => { // eslint-disable-line
  res.render('viewOrder', { layout: 'main' })
}

controller.renderAddPart = async (req, res) => { // eslint-disable-line
  res.render('addPart', { layout: 'main' })
}

controller.tryAddPart = async (req, res) => { // eslint-disable-line
  console.log('add part')
  console.log(req.body.partName)
  console.log(req.body.partNumber)
  console.log(req.body.partQuantity)

  res.render('stock', { layout: 'main' })
}

controller.renderViewStock = async (req, res) => { // eslint-disable-line
  res.render('viewStock', { layout: 'main' })
}
