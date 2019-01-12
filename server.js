const cookieSession = require( 'cookie-session' );
const LocalStrategy = require( 'passport-local' );
const bodyParser = require( 'body-parser' );
const mongoose = require( 'mongoose' );
const passport = require( 'passport' );
const express = require( 'express' );
const next = require( 'next' );
const keys = require( './config/keys' );

// Models
const Settings = require( './models/settings' );
const User = require( './models/user' );

// Classes
const ContactRoutes = require( './classes/contactRoutes' );
const AdminRoutes = require( './classes/adminRoutes' );
const AuthRoutes = require( './classes/authRoutes' );
const PostRoutes = require( './classes/postRoutes' );

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Mongo config
mongoose.connect( keys.mongoURI, { useNewUrlParser: true });
mongoose.set( 'useFindAndModify', false );
mongoose.Promise = global.Promise;

app.prepare()
  .then( () => {

    const server = express();

    // Middleware helpers
    server.use( bodyParser.json() );
    server.use( bodyParser.urlencoded({ extended: true }) );
    server.use( cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [keys.cookieKey]
    }));

    // Passport config
    server.use( passport.initialize() );
    server.use( passport.session() );
    passport.use( new LocalStrategy( User.authenticate() ) );
    passport.serializeUser( User.serializeUser() );
    passport.deserializeUser( User.deserializeUser() );

    // Configure app settings
    let appSettings;

    // Search for a settings document
    Settings.find().exec(( error, settings ) => {

      if ( error ) {
        console.log( error );
      }

      // We only EVER want ONE settings document
      // If no document exists, create one and rerun function
      if ( settings.length === 0 ) {
        appSettings = new Settings();
        appSettings.save();
        console.log( 'New settings document created' );

        // Give mongo time to save the document 
        // before running the funciton again
        // to prevent creating a duplicate settings document
        setTimeout( () => {}, 3000 );
      } else {
        appSettings = settings[0];
      }
    });

    let users;

    // Get all users to store in res.locals
    User.find().exec( ( error, foundUsers ) => {
      users = foundUsers;
    });

    // Set user and settings to res.locals
    server.use( ( req, res, next ) => {

      res.locals.currentUser = req.user;
      res.locals.settings = appSettings;
      res.locals.users = users;

      next();
    });

    // Root Route
    server.get( '/', ( req, res ) => {
      const actualPage = '/index';
      
      app.render( req, res, actualPage );
    });

    // Register Routes
    new AdminRoutes( server, app );
    new AuthRoutes( server, app );
    new PostRoutes( server, app, 'posts' );
    new ContactRoutes( server, app );

    // Anything without a specified route
    server.get( '*', ( req, res ) => {
      return handle( req, res );
    });

    server.listen( keys.port, ( err ) => {
      if ( err ) {
        throw err;
      }
      console.log( '> Ready on http://localhost:3000' );
    });

  }).catch( ( ex ) => {
    console.error( ex.stack )
    process.exit( 1 )
  });