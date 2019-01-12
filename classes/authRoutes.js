const Mailchimp = require( 'mailchimp-api-v3' );
const UserModel = require( '../models/user' );
const passport = require( 'passport' );
const keys = require( '../config/keys' );

class AuthRoutes {

  constructor( server, app ) {

    this.server = server;
    this.app = app;
    this.UserModel = UserModel;
    this.passport = passport;
    this.mailchimp = new Mailchimp( keys.mailchimpKey );

    this.registerRoutes();
  }


  registerRoutes() {

    // Views
    this.server.get( '/login', this.renderPage.bind( this ) );
    this.server.get( '/profile', this.renderPage.bind( this ) );

    // API
    this.server.post( '/api/register', this.registerUser.bind( this ) );
    this.server.post( '/api/login', this.passport.authenticate( 'local', {} ), this.sendCurrentUser.bind( this ) );
    this.server.get( '/api/currentUser', this.sendCurrentUser.bind( this ) );
    this.server.put( '/api/currentUser', this.updateCurrentUser.bind( this ) );
    this.server.post( '/api/changePassword', this.changeUserPassword.bind( this ) );
    this.server.get( '/api/logout', this.logoutUser.bind( this ) );
  }


  async sendWelcomeEmail( res, userEmail ) {

    if ( res.locals.settings.enableEmailing ) {
      const result = await this.mailchimp.get('/lists');
      const list = result.lists[0];

      const memberInfo = {
        email_address: userEmail,
        status: 'unsubscribed',
      };
      
      this.mailchimp.post(`/lists/${list.id}/members`, memberInfo);
    }
  }


  renderPage( req, res ) {

    this.app.render( req, res, req.url );
  }


  sendCurrentUser( req, res ) {

    res.send( req.user );
  }


  registerUser( req, res ) {

    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { username, password, passwordConfirm } = req.body;

    // Make sure "username" is in email format
    if ( !regex.test( String( username ).toLowerCase() ) ) {
      res.send({ error: { message: 'Please use a valid email address' } });
    }

    // Make sure password fields match
    if ( password !== passwordConfirm ) {
      res.send({ error: { message: 'The password fields need to match' } });
    }

    // The LocalStrategy module requires a username
    // Set username and email as the user's email
    const newUser = new this.UserModel({
      username, email: username
    });

    this.UserModel.register( newUser, password, err => {
      if ( err ) {
        res.send({ error: err });
      }

      this.passport.authenticate( 'local' )( req, res, () => {
        this.sendWelcomeEmail( res, newUser.email );
        res.send( 'success' );
      });
    });
  }


  async updateCurrentUser( req, res ) {

    const { userId, firstName, lastName } = req.body;

    // Make sure the user submitting the form is the logged in on the server
    if ( userId.toString() !== req.user._id.toString() ) {
      res.send({ error: 'Something went wrong.' });
    }

    const newUserData = { firstName, lastName };
    const updatedUser = await this.UserModel.findOneAndUpdate( { _id: userId }, newUserData );

    res.send( updatedUser );
  }


  changeUserPassword( req, res ) {

    const { oldPassword, newPassword, newPasswordConfirm, userId } = req.body;

    // Make sure password fields are filled out
    if ( !oldPassword ) {
      res.send({ error: 'You need to fill in your current password.' });
    } else if (!newPassword) {
      res.send({ error: 'You need to fill in your new password.' });
    }

    this.UserModel.findById( userId, ( err, foundUser ) => {
      if (!!foundUser) {
        // Make sure the entered password is the user's password
        foundUser.authenticate( oldPassword, ( err, user, passwordError ) => {
          if ( !!user ) {
            // Check to see new password fields match
            if ( newPassword !== newPasswordConfirm ) {
              res.send({ error: 'The new password fields do not match.' });
            } else {
              // Set the new password
              foundUser.setPassword( newPassword, () => {
                foundUser.save();
                res.send({ success: 'Password changed!' });
              });
            }
          } else if ( !!err ) {
            console.log( err );
          } else if ( !!passwordError ) {
            res.send({ error: 'You have entered the wrong current password.' });
          }
        });
      } else {
        console.log( err );
      }
    });
  }
  

  logoutUser( req, res ) {

    req.logout();

    res.send( 'logged out' );
  }
}


module.exports = AuthRoutes;
