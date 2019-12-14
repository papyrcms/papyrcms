// Node Modules
const cookieSession = require('cookie-session')
const LocalStrategy = require('passport-local')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const express = require('express')
const next = require('next')
const cors = require('cors')
const fs = require('fs')

// App keys
const keys = require('./config/keys')

// Models
const User = require('./models/user')

// Controllers, filtering out the abstract controller
const controllers = fs.readdirSync('./controllers').filter(controller => controller !== 'abstractController.js')

// Require controllers
controllers.forEach((controller, index) => {
  controllers[index] = require(`./controllers/${controller}`)
})

// Mongo config
const mongooseConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
mongoose.connect(keys.mongoURI, mongooseConfig)
mongoose.plugin(schema => { schema.options.usePushEach = true })

const server = express()

// CORS
server.use(cors({
  methods:['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

// Middleware helpers
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey]
}))

// Passport config
server.use(passport.initialize())
server.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// Instantiate res.locals.settings
server.use(async (req, res, next) => {
  if (!res.locals.settings) {
    res.locals.settings = {}
  }
  next()
})


// Check if the user is banned
const middleware = require('./utilities/middleware')
server.use(middleware.checkIfBanned)


// Server config
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {

  // Instantiate Controllers
  controllers.forEach((Controller, index) => {
    controllers[index] = new Controller(server, app)
  })

  // Register settings
  controllers.forEach(controller => {
    controller.registerSettings()
  })

  // Register Controller Routes
  controllers.forEach(controller => {
    controller.registerRoutes()
  })

  // Get plugin pages

  // Anything without a specified route
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(keys.port, err => {
    if (err) {
      throw err
    }
    console.log(`> Ready on ${keys.rootURL}`)
  })
}).catch(ex => {
  console.error(ex.stack)
  process.exit(1)
})
