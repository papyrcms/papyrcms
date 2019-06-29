// Node Modules
const cookieSession = require('cookie-session')
const LocalStrategy = require('passport-local')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const express = require('express')
const next = require('next')
const cors = require('cors')

// App keys
const keys = require('./config/keys')

// Models
const Post = require('./models/post')
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

// Server config
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const server = express()

// Mongo config
mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
mongoose.set('useFindAndModify', false)
mongoose.plugin(schema => { schema.options.usePushEach = true })
mongoose.Promise = global.Promise

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

// Set user and settings to res.locals
const { configureSettings } = require('./utilities/middleware')
server.use(configureSettings)

app.prepare().then(() => {

  // Root Route
  server.get('/', async (req, res) => {
    const actualPage = '/index'
    const posts = await Post.find({ published: true }).sort({ created: -1 })
    const queryParams = { posts, googleMapsKey: keys.googleMapsKey }

    app.render(req, res, actualPage, queryParams)
  })

  server.post('/api/googleAnalyticsId', (req, res) => {
    if (keys.rootURL.includes(req.get('host'))) {
      res.send(keys.googleAnalyticsId)
    } else {
      res.send('nunya beezwax')
    }
  })

  server.post('/api/googleMapsKey', (req, res) => {
    if (keys.rootURL.includes(req.get('host'))) {
      res.send(keys.googleMapsKey)
    } else {
      res.send('nunya beezwax')
    }
  })

  // Register Routes
  new AdminRoutes(server, app)
  new AuthRoutes(server, app)
  new PostRoutes(server, app)
  new CommentRoutes(server, app)
  new ContactRoutes(server, app)
  new PaymentRoutes(server, app)
  new BlogRoutes(server, app)
  // new StoreRoutes(server, app)

  // Anything without a specified route
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(keys.port, (err) => {
    if (err) {
      throw err
    }
    console.log(`> Ready on ${keys.rootURL}`)
  })
}).catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})