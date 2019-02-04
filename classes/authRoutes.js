const UserModel = require( '../models/user' )
const Mailer = require( './mailer' )
const passport = require( 'passport' )

class AuthRoutes {

  constructor( server, app ) {

    this.server = server
    this.app = app

    this.registerRoutes()
  }


  registerRoutes() {

    // Views
    this.server.get( '/login', this.renderPage.bind( this ) )
    this.server.get( '/profile', this.renderPage.bind( this ) )

    // API
    this.server.post( '/api/register', this.registerUser.bind( this ) )
    this.server.post( '/api/login', passport.authenticate( 'local', {} ), this.sendCurrentUser.bind( this ) )
    this.server.get( '/api/currentUser', this.sendCurrentUser.bind( this ) )
    this.server.put( '/api/currentUser', this.updateCurrentUser.bind( this ) )
    this.server.post( '/api/changePassword', this.changeUserPassword.bind( this ) )
    this.server.get( '/api/logout', this.logoutUser.bind( this ) )
  }


  allowRegister( req, res, next ) {

    if ( res.locals.settings.enableRegistration ) {
      next()
    } else {
      res.status(400).send({ message: 'You\'re not allowed to do that.' })
    }
  }


  renderPage( req, res ) {

    this.app.render( req, res, req.url )
  }


  sendCurrentUser( req, res ) {

    res.send( res.locals.currentUser )
  }


  registerUser( req, res ) {

    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const { firstName, lastName, username, password, passwordConfirm } = req.body

    if ( !firstName || firstName === '' ) {
      res.status(400).send({ message: 'Please enter your first name' })
    }

    if ( !lastName || lastName === '' ) {
      res.status(400).send({ message: 'Please enter your last name' })
    }

    // Make sure "username" is in email format
    if ( !regex.test( String( username ).toLowerCase() ) ) {
      res.status(400).send({ message: 'Please use a valid email address' })
    }

    // Make sure password fields match
    if ( password !== passwordConfirm ) {
      res.status(400).send({ message: 'The password fields need to match' })
    }

    // The LocalStrategy module requires a username
    // Set username and email as the user's email
    const newUser = new UserModel({
      username, email: username, firstName, lastName
    })

    UserModel.register( newUser, password, err => {
      if ( err ) {
        res.send({ error: err })
      }

      passport.authenticate( 'local' )( req, res, () => {

        const mailer = new Mailer()
        const templatePath = 'emails/welcome.html'
        const subject = `Welcome, ${newUser.firstName}!`
        
        if ( res.locals.settings.enableEmailing ) {
          mailer.sendEmail( newUser, templatePath, newUser.email, subject )
        }

        res.send( 'success' )
      })
    })
  }


  async updateCurrentUser( req, res ) {

    const { userId, firstName, lastName } = req.body

    // Make sure the user submitting the form is the logged in on the server
    if ( userId.toString() !== req.user._id.toString() ) {
      const message = 'There\'s a problem with your session. Try logging out and logging back in'
      res.status(400).send({ message })
    }

    const newUserData = { firstName, lastName }
    const updatedUser = await UserModel.findOneAndUpdate( { _id: userId }, newUserData )

    res.send( updatedUser )
  }


  changeUserPassword( req, res ) {

    const { oldPassword, newPassword, newPasswordConfirm, userId } = req.body

    // Make sure password fields are filled out
    if ( !oldPassword ) {
      res.status(400).send({ message: 'You need to fill in your current password.' })
    } else if (!newPassword) {
      res.status(400).send({ message: 'You need to fill in your new password.' })
    }

    UserModel.findById( userId, ( err, foundUser ) => {
      if (!!foundUser) {
        // Make sure the entered password is the user's password
        foundUser.authenticate( oldPassword, ( err, user, passwordError ) => {
          if ( !!user ) {
            // Check to see new password fields match
            if ( newPassword !== newPasswordConfirm ) {
              res.status(400).send({ message: 'The new password fields do not match.' })
            } else {
              // Set the new password
              foundUser.setPassword( newPassword, () => {
                foundUser.save()
                res.send({ message: 'Your password has been saved!' })
              })
            }
          } else if ( !!err ) {
            res.status(400).send( err )
          } else if ( !!passwordError ) {
            res.status(400).send({ message: 'You have entered the wrong current password.' })
          }
        })
      } else {
        res.status(400).send( err )
      }
    })
  }
  

  logoutUser( req, res ) {

    req.logout()

    res.send( 'logged out' )
  }
}


module.exports = AuthRoutes
