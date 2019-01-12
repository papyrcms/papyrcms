const MessageModel = require('../models/message');

class ContactRoutes {

  constructor( server, app ) {

    this.server = server;
    this.app = app;
    this.MessageModel = MessageModel;

    this.registerRoutes();
  }


  registerRoutes() {

    // Views
    this.server.get( '/contact', this.renderPage.bind( this ) );

    // Message API
    this.server.post( '/api/contact', this.createMessage.bind( this ) );
  }


  renderPage( req, res ) {

    const actualPage = '/contact';

    this.app.render( req, res, actualPage );
  }


  createMessage( req, res ) {

    const { contactName, contactEmail, contactMessage } = req.body;
    const messageObj = {
      name: contactName,
      email: contactEmail,
      message: contactMessage,
    };
    const message = new this.MessageModel( messageObj );

    message.save();
    res.send( message );
  }
}


module.exports = ContactRoutes;
