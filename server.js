import cookieSession from 'cookie-session'
import LocalStrategy from 'passport-local'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import passport from 'passport'
import express from 'express'
import next from 'next'
import fs from 'fs'
import User from './models/user'

// App keys
import keys from './config/keys'
const { mongoURI, cookieKey, port, rootURL } = keys

// Mongo config
const mongooseConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
mongoose.connect(mongoURI, mongooseConfig)
mongoose.plugin(schema => { schema.options.usePushEach = true })

const server = express()

// Middleware helpers
// server.use(bodyParser.json())
// server.use(bodyParser.urlencoded({ extended: true }))
server.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [cookieKey]
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

app.prepare().then(async () => {

  // Controllers, filtering out the abstract controller
  const controllers = fs.readdirSync('./controllers').filter(controller => controller !== 'abstractController.js')

  // import and instantiate controllers
  for (let i = 0; i < controllers.length; i++) {
    const Controller = await import(`./controllers/${controllers[i]}`)
    controllers[i] = new Controller.default(server, app)
  }

  // Register settings
  controllers.forEach(controller => {
    controller.registerSettings()
  })

  // Register Controller Routes
  controllers.forEach(controller => {
    controller.registerRoutes()
  })

  // Anything without a specified route
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) {
      throw err
    }
    console.log(`> Ready on ${rootURL}`)
  })
}).catch(ex => {
  console.error(ex.stack)
  process.exit(1)
})
