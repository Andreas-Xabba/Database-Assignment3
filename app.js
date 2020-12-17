const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

const PORT = 8000
const createError = require('http-errors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const logger = require('morgan')
const favicon = require('serve-favicon')
const exphbs = require('express-handlebars')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({
  server: server,
  clientTracking: true
})

app.set('view engine', 'hbs')
app.engine('hbs', exphbs({
  extname: 'hbs',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views', 'partials')
}))

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static(path.join(__dirname, 'public')))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const indexRouter = require('./routes/index')

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'nyan cat is better'
}))

app.use('/', indexRouter.router)

app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

wss.broadcastExcept = (ws, data) => { //eslint-disable-line
  let clients = 0

  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      clients++
      client.send(data)
    }
  })
  console.log(`Broadcasted data to ${clients} (${wss.clients.size}) clients.`)
}

wss.on('connection', (ws /*, req */) => {
  console.log('Connection received. Adding client.')

  wss.broadcastExcept(ws, `New client connected (${wss.clients.size}).`)

  ws.on('message', (message) => {
    console.log('Received: %s', message)
    wss.broadcastExcept(ws, message)
  })

  ws.on('error', (error) => {
    console.log(`Server error: ${error}`)
  })

  ws.on('close', (code, reason) => {
    console.log(`Closing connection: ${code} ${reason}`)
    wss.broadcastExcept(ws, `Client disconnected (${wss.clients.size}).`)
  })
})

server.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
