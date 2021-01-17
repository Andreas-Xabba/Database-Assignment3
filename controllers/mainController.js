const controller = {}
module.exports = controller
const mysql = require('mysql')

const con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
})

con.connect(function (err) {
  if (err) throw err
  console.log('Connected!')
})

const schema = process.env.MYSQL_SCHEMA

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
  const sql = `SELECT code, name FROM ${schema}.model`

  con.query(sql, function (err, result) {
    if (err) throw err
    res.render('createOrder', { layout: 'main', data: result })
  })
}

controller.tryCreateOrder = async (req, res) => { // eslint-disable-line
  const timeStamp = _getTimeStamp()

  const customersql = `INSERT INTO ${schema}.customer (name, id, phone) VALUES ("${req.body.customerName}", "${req.body.customerSSN}", ${req.body.customerPhone})`
  const devicesql = `INSERT INTO ${schema}.device (IMEI, problem, color, created, customerId, modelCode) VALUES ("${req.body.deviceIMEI}", "${req.body.deviceProblem}", "${req.body.deviceColor}", "${timeStamp}", "${req.body.customerSSN}", "${req.body.deviceModel}")`
  const repairsql = `INSERT INTO ${schema}.repairation (deviceIMEI, customerId) VALUES ("${req.body.deviceIMEI}", "${req.body.customerSSN}")`

  con.query(customersql, function (err, result) {
    if (err) throw err
    con.query(devicesql, function (err, result) {
      if (err) throw err
      con.query(repairsql, function (err, result) {
        if (err) throw err
        res.render('orders', { layout: 'main', message: 'Order successfully created!' })
      })
    })
  })
}

controller.renderViewOrder = async (req, res) => { // eslint-disable-line
  const sql = `SELECT * FROM ${schema}.repairation`

  con.query(sql, function (err, result) {
    if (err) throw err
    res.render('viewOrder', { layout: 'main', data: result })
  })
}

controller.renderViewOrderItem = async (req, res) => { // eslint-disable-line
  const sql = `SELECT * FROM (SELECT name, phone, completed, deviceIMEI, customerId AS customerId, repairation.id AS repairId FROM ${schema}.repairation JOIN ${schema}.customer ON ${schema}.repairation.customerId = ${schema}.customer.id) AS orderCustomerTable WHERE repairId = ${req.params.id}`

  con.query(sql, function (err, dataResult) {
    if (err) throw err
    const existingPartsSql = `SELECT * FROM ${schema}.includes JOIN ${schema}.component ON ${schema}.includes.componentNumber = ${schema}.component.number WHERE reperationId = ${req.params.id}`
    con.query(existingPartsSql, function (err, existingPartsResult) {
      if (err) throw err
      let totalsum = 0
      for (const part of existingPartsResult) {
        totalsum += Number(part.price)
      }
      const availablePartsSql = `SELECT * FROM ${schema}.component WHERE number IN (SELECT componentNumber FROM ${schema}.consistsof JOIN ${schema}.device ON ${schema}.consistsof.modelCode = ${schema}.device.modelCode WHERE IMEI = ${dataResult[0].deviceIMEI})`
      con.query(availablePartsSql, function (err, availablePartsResult) {
        if (err) throw err
        console.log(availablePartsResult)
        res.render('viewOrderItem', { layout: 'main', data: dataResult[0], parts: existingPartsResult, availableParts: availablePartsResult, totalsum: totalsum })
      })
    })
  })
}

controller.tryOrderItemChange = async (req, res) => { // eslint-disable-line
  switch (req.body.submit) {
    case 'Close Order': {
      const sql = `UPDATE ${schema}.repairation SET completed = "${_getTimeStamp()}" WHERE id = ${req.params.id}`
      con.query(sql, function (err, result) {
        if (err) throw err
        res.redirect(`/orders/view/item/${req.params.id}`)
      })
      break
    }
    case 'Open Order': {
      const sql = `UPDATE ${schema}.repairation SET completed = null WHERE id = ${req.params.id}`
      con.query(sql, function (err, result) {
        if (err) throw err
        res.redirect(`/orders/view/item/${req.params.id}`)
      })
      break
    }
    case 'Add Part': {
      console.log(req.body)
      const sql = `INSERT INTO ${schema}.includes (componentNumber, reperationId) VALUES ("${req.body.orderPart}", ${req.params.id})`
      con.query(sql, function (err, result) {
        if (err) {
          console.log(`duplicate found: ${req.body.orderPart}`)
        }
        const updateStockSql = `UPDATE ${schema}.stock SET quantity = quantity - 1 WHERE componentNumber = "${req.body.orderPart}"`
        con.query(updateStockSql, function (err, result) {
          if (err) throw err
          res.redirect(`/orders/view/item/${req.params.id}`)
        })
      })
      break
    }
    case 'remove': {
      console.log(req.body)
      const deleteComponentFromOrderSql = `DELETE FROM ${schema}.includes WHERE reperationId=${req.params.id} AND componentNumber="${req.body.partNumber}"`
      con.query(deleteComponentFromOrderSql, function (err, result) {
        if (err) throw err
        const updateStockSql = `UPDATE ${schema}.stock SET quantity = quantity + 1 WHERE componentNumber = "${req.body.partNumber}"`
        con.query(updateStockSql, function (err, result) {
          if (err) throw err
          res.redirect(`/orders/view/item/${req.params.id}`)
        })
      })
      break
    }
    default: {
      console.log('default case')
    }
  }
}

controller.renderAddPart = async (req, res) => { // eslint-disable-line
  res.render('addPart', { layout: 'main' })
}

controller.tryAddPart = async (req, res) => { // eslint-disable-line
  console.log('add part')

  const sql =
  `INSERT INTO ${schema}.component (name, number, price) VALUES ("${req.body.partName}", "${req.body.partNumber}", ${req.body.partPrice})`

  console.log(sql)
  await con.query(sql, function (err, result) {
    if (err) {
      res.render('error', { layout: 'empty' })
    } else {
      res.render('stock', { layout: 'main' })
    }
  })
}

controller.renderViewStock = async (req, res) => { // eslint-disable-line

  const sql =
  `SELECT * FROM ${schema}.full_stock`

  con.query(sql, function (err, result) {
    if (err) throw err
    res.render('viewStock', { layout: 'main', data: result })
  })
}

controller.renderPart = async (req, res) => { // eslint-disable-line
  const partnumber = req.params.partNumber
  const sql =
  `SELECT * FROM ${schema}.full_stock WHERE number = "${partnumber}"`

  con.query(sql, function (err, result) {
    console.log(result)
    if (err) throw err
    if (result.length > 0) {
      res.render('viewPart', { layout: 'main', data: result[0] })
    } else {
      res.render('error', { layout: 'empty' })
    }
  })
}

controller.updatePart = async (req, res) => { // eslint-disable-line
  const formData = req.body
  console.log(formData)
  const sql = `UPDATE ${schema}.component SET name = "${formData.name}", price = ${formData.price} WHERE number = "${formData.number}"`
  console.log(sql)
  await con.query(sql, function (err, result) {
    if (err) throw err
    res.redirect('/stock/view')
  })
}

controller.renderLocation = async (req, res) => { // eslint-disable-line
  const locationNumber = req.params.locationNumber
  const sqlstock = `SELECT * FROM ${schema}.stock WHERE location = "${locationNumber}"`
  const sqlcomponents = `SELECT * FROM ${schema}.component`

  con.query(sqlstock, function (err, result1) {
    if (err) throw err
    con.query(sqlcomponents, function (err, result2) {
      if (err) throw err
      if (result1.length > 0) {
        res.render('viewLocation', { layout: 'main', locationData: result1[0], componentData: result2 })
      } else {
        res.render('error', { layout: 'empty' })
      }
    })
  })
}

controller.renderAddLocation = async (req, res) => { // eslint-disable-line
  const sql =
  `SELECT * FROM ${schema}.component`

  con.query(sql, function (err, result) {
    console.log(result)
    if (err) throw err
    res.render('addLocation', { layout: 'main', components: result })
  })
}

controller.tryAddLocation = async (req, res) => { // eslint-disable-line
  console.log(req.body)
  let sql = `INSERT INTO ${schema}.stock (location`
  if (req.body.partNumber) {
    sql += ', componentNumber, quantity'
  }
  sql += `) VALUES ("${req.body.locationID}"`
  if (req.body.partNumber) {
    sql += `, "${req.body.partNumber}"`
    if (req.body.partQuantity) {
      sql += `, ${req.body.partQuantity}`
    } else {
      sql += ', 0'
    }
  }
  sql += ')'
  console.log(sql)
  if (await _existsInDatabase('component', 'number', req.body.partNumber)) {
    console.log('exists')
  } else {
    console.log('doesnt not exist')
  }
  await con.query(sql, function (err, result) {
    if (err) throw err
    res.render('stock', { layout: 'main' })
  })
}

controller.updateLocation = async (req, res) => { // eslint-disable-line
  const formData = req.body
  console.log(formData)
  const sql = `UPDATE ${schema}.stock SET componentNumber = "${formData.number}", quantity = ${formData.quantity} WHERE location = "${formData.location}"`
  await con.query(sql, function (err, result) {
    if (err) throw err
    res.redirect('/stock/view')
  })
}

controller.renderModels = async (req, res) => { // eslint-disable-line
  res.render('model', { layout: 'main' })
}

controller.renderCreateModel = async (req, res) => { // eslint-disable-line
  const sql =
  `SELECT * FROM ${schema}.component`

  con.query(sql, function (err, result) {
    if (err) throw err
    res.render('createModel', { layout: 'main', data: result })
  })
}

controller.tryCreateModel = async (req, res) => { // eslint-disable-line
  console.log(req.body)
  const sql = `INSERT INTO ${schema}.model (code,name,size) VALUES ("${req.body.modelNumber}","${req.body.modelName}",${req.body.modelSize})`
  con.query(sql, function (err, result) {
    if (err) throw err
    const componentList = req.body.componentList.split('|')
    for (let i = 1; i < componentList.length - 1; i++) {
      console.log(componentList)
      const componentNumber = componentList[i]
      const sql = `INSERT INTO ${schema}.consistsof (modelCode,componentNumber) VALUES ("${req.body.modelNumber}","${componentNumber}")`
      con.query(sql, function (err, result) {
        if (err) throw err
        console.log(componentNumber + ' added')
      })
    }
    res.redirect('/model')
  })
}

controller.renderViewModel = async (req, res) => { // eslint-disable-line
  const sql = `SELECT * FROM ${schema}.model`

  con.query(sql, function (err, result) {
    if (err) throw err
    res.render('viewModel', { layout: 'main', data: result })
  })
}

async function _existsInDatabase (table, column, value) { // eslint-disable-line
  const sql = `SELECT TOP 1 ${schema}.${table}.${column} FROM ${schema}.${table} WHERE ${schema}.${table}.${column} = "${value}"`
  return await con.query(sql, function (err, result) {
    console.log(result)
    if (err) {
      return false
    }
    if (result.length > 0) {
      return true
    } else {
      return false
    }
  })
}

function _formatTime (timeparameter) { // eslint-disable-line
  const timeString = timeparameter.toString()
  if (timeString.length === 1) {
    return '0' + timeString
  } else {
    return timeString
  }
}

function _getTimeStamp() { // eslint-disable-line
  const dateTime = new Date()
  const timeStamp = `${_formatTime(dateTime.getFullYear())}-${_formatTime(dateTime.getMonth() + 1)}-${_formatTime(dateTime.getDate())} ${_formatTime(dateTime.getHours())}:${_formatTime(dateTime.getMinutes())}:${_formatTime(dateTime.getSeconds())}`
  return timeStamp
}
