const SettingsModel = require('../models/settings');

class AdminRoutes {

  constructor( server, app ) {

    this.server = server;
    this.app = app;
    this.SettingsModel = SettingsModel;
    this.settings = {};

    this.getSettings();
    this.registerRoutes();
  }


  async getSettings() {

    // Get our settings
    const settings = await this.SettingsModel.find();

    // Assign the first (and only) document as our settings
    this.settings = settings[0];
  }


  registerRoutes() {

    // Views
    this.server.get( '/admin', this.renderPage.bind( this ) );

    // API
    this.server.post( '/admin/settings', this.changeSettings.bind( this ) );
  }


  // Redirect to home if a user is not logged in
  // or if the logged in user is not an admin
  renderPage( req, res ) {

    if ( req.user && req.user.isAdmin ) {
      const queryParams = { users: res.locals.users };

      this.app.render( req, res, req.url, queryParams );
    } else {

      res.redirect( '/' );
    }
  }


  async assignSettings( res ) {

    // Get the new settings
    const settings = await this.SettingsModel.findById( this.settings._id );

    // Assign settings to this object
    this.settings = settings;

    // Assign new settings to res.locals
    res.locals.settings = this.settings;

    res.send( this.settings );
  }


  async changeSettings( req, res ) {

    if ( req.user && req.user.isAdmin ) {

      // Update the settings document in the db
      const settingsDocument = { _id: this.settings._id };
      await this.SettingsModel.findOneAndUpdate( settingsDocument, req.body ).exec();

      // Update settings within the app
      this.assignSettings( res );
    } else {

      res.send( 'You need to be an admin to do that' );
    }
  }
}


module.exports = AdminRoutes;