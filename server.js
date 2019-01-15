const cookieSession = require( 'cookie-session' )
const LocalStrategy = require( 'passport-local' )
const bodyParser = require( 'body-parser' )
const mongoose = require( 'mongoose' )
const passport = require( 'passport' )
const express = require( 'express' )
const next = require( 'next' )
const keys = require( './config/keys' )

// Models
const Settings = require( './models/settings' )
const Post = require( './models/post' )
const User = require( './models/user' )

// Classes
const ContactRoutes = require( './classes/contactRoutes' )
const AdminRoutes = require( './classes/adminRoutes' )
const AuthRoutes = require( './classes/authRoutes' )
const PostRoutes = require( './classes/postRoutes' )

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const server = express()

// Mongo config
mongoose.connect( keys.mongoURI, { useNewUrlParser: true })
mongoose.set( 'useFindAndModify', false )
mongoose.Promise = global.Promise

// Middleware helpers
server.use( bodyParser.json() )
server.use( bodyParser.urlencoded({ extended: true }) )
server.use( cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey]
}))

// Passport config
server.use( passport.initialize() )
server.use( passport.session() )
passport.use( new LocalStrategy( User.authenticate() ) )
passport.serializeUser( User.serializeUser() )
passport.deserializeUser( User.deserializeUser() )

// Configure app settings
let appSettings

// Search for a settings document
Settings.find().exec(( error, settings ) => {

  if ( error ) {
    console.log( error )
  }

  // We only EVER want ONE settings document
  // If no document exists, create one and rerun function
  if ( settings.length === 0 ) {
    appSettings = new Settings()
    appSettings.save()
    console.log( 'New settings document created' )

    // Give mongo time to save the document 
    // before running the funciton again
    // to prevent creating a duplicate settings document
    setTimeout( () => {}, 3000 )
  } else {
    appSettings = settings[0]
  }
})

// Set user and settings to res.locals
server.use( ( req, res, done ) => {

  res.locals.currentUser = req.user
  res.locals.settings = appSettings

  done()
})

app.prepare().then( () => {

  // Root Route
  server.get( '/', async ( req, res ) => {
    const actualPage = '/index'
    const posts = await Post.find({ published: true }).sort({ created: -1 })
    const queryParams = { posts }

    app.render( req, res, actualPage, queryParams )
  })

  // Register Routes
  new AdminRoutes( server, app )
  new AuthRoutes( server, app )
  new PostRoutes( server, app, 'posts' )
  new ContactRoutes( server, app )

  // Anything without a specified route
  server.get( '*', ( req, res ) => {
    return handle( req, res )
  })

  server.listen( keys.port, ( err ) => {
    if ( err ) {
      throw err
    }
    console.log( `> Ready on ${keys.rootURL}` )
  })

}).catch( ( ex ) => {
  console.error( ex.stack )
  process.exit( 1 )
})