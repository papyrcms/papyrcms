// Node Modules
const cookieSession = require('cookie-session')
const LocalStrategy = require('passport-local')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const express = require('express')
const next = require('next')
const cors = require('cors')
const _ = require('lodash')

// App keys
const keys = require('./config/keys')

// Models
const User = require('./models/user')

// Controllers
const ContactRoutes = require('./controllers/contactRoutes')
const PaymentRoutes = require('./controllers/paymentRoutes')
const AdminRoutes = require('./controllers/adminRoutes')
const AuthRoutes = require('./controllers/authRoutes')
const PostRoutes = require('./controllers/postRoutes')
const BlogRoutes = require('./controllers/blogRoutes')
const CommentRoutes = require('./controllers/commentRoutes')
const StoreRoutes = require('./controllers/storeRoutes')
// const EventRoutes = require('./controllers/eventRoutes')

// Mongo config
mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
mongoose.set('useFindAndModify', false)
mongoose.plugin(schema => { schema.options.usePushEach = true })
mongoose.Promise = global.Promise

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

// configure main app settings
const { configureSettings } = require('./utilities/functions')
server.use(async (req, res, next) => {

  // Instantiate res.locals.settings
  if (!res.locals.settings) {
    res.locals.settings = {}
  }

  const defaultSettings = { enableMenu: false }
  const settings = await configureSettings('app', defaultSettings)

  _.map(settings, (optionValue, optionKey) => {
    res.locals.settings[optionKey] = optionValue
  })
  next()
})

// Server config
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {

  const UtilityRoutes = require('./utilities/routes')
  new UtilityRoutes(server, app)

  // Instantiate Controllers
  const controllers = [
    new AdminRoutes(server, app),
    new AuthRoutes(server, app),
    new PostRoutes(server, app),
    new CommentRoutes(server, app),
    new ContactRoutes(server, app),
    new PaymentRoutes(server, app),
    new BlogRoutes(server, app),
    // new StoreRoutes(server, app),
    // new EventRoutes(server, app)
  ]

  // Register settings
  controllers.forEach(controller => {
    controller.registerSettings()
  })

  // Register Routes
  controllers.forEach(controller => {
    controller.registerRoutes()
  })

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