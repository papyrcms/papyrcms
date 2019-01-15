const Email = require( 'email-templates' )
const MessageModel = require('../models/message')
const keys = require( '../config/keys' )

class ContactRoutes {

  constructor( server, app ) {

    this.server = server
    this.app = app
    this.MessageModel = MessageModel

    this.registerRoutes()
  }


  registerRoutes() {

    // Views
    this.server.get( '/contact', this.renderPage.bind( this ) )

    // Message API
    this.server.post( '/api/contact', this.createMessage.bind( this ) )
  }


  renderPage( req, res ) {

    const actualPage = '/contact'

    this.app.render( req, res, actualPage )
  }


  sendEmail( message ) {

    const email = new Email({
      message: {
        from: keys.siteEmail
      },
      send: true,
      transport: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: keys.siteEmail,
          clientId: keys.gmailClientId,
          clientSecret: keys.gmailClientSecret,
          refreshToken: keys.gmailRefreshToken,
          accessToken: keys.gmailAccessToken
        }
      }
    })

    email.send({
      template: 'contact',
      message: {
        to: keys.adminEmail
      },
      locals: {
        message
      }
    })
    .then()
    .catch(error => console.log(error))
  }


  createMessage( req, res ) {

    const { contactName, contactEmail, contactMessage } = req.body
    const messageObj = {
      name: contactName,
      email: contactEmail,
      message: contactMessage,
    }
    const message = new this.MessageModel( messageObj )

    this.sendEmail( message )

    message.save()
    res.send( message )
  }
}


module.exports = ContactRoutes
