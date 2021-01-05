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
  const sql =
  `SELECT number, name, price'
  'FROM ${schema}.component`

  con.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
  })
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
    if (err) throw err
  })

  res.render('stock', { layout: 'main' })
}

controller.renderViewStock = async (req, res) => { // eslint-disable-line

  const sql =
  `SELECT * FROM ${schema}.component`
  // let data = null
  con.query(sql, function (err, result) {
    if (err) throw err
    res.render('viewStock', { layout: 'main', data: result })
  })
}

controller.renderPart = async (req, res) => { // eslint-disable-line
  const partnumber = req.params.partNumber
  const sql =
  `SELECT * FROM ${schema}.component WHERE number = "${partnumber}"`
  console.log(sql)
  // let data = null
  con.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
    res.render('viewPart', { layout: 'main', data: result[0] })
  })
}
