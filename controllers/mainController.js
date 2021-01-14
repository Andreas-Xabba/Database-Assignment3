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
  console.log(req.body.partPrice)

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
  res.render('createModel', { layout: 'main' })
}

controller.renderViewModel = async (req, res) => { // eslint-disable-line
  res.render('viewModel', { layout: 'main' })
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
