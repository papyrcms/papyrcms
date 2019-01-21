const SettingsModel = require('../models/settings')
const UserModel = require('../models/user')

class AdminRoutes {

  constructor( server, app ) {

    this.server = server
    this.app = app
    this.settings = {}

    this.getSettings()
    this.registerRoutes()
  }


  async getSettings() {

    // Get our settings
    const settings = await SettingsModel.find()

    // Assign the first (and only) document as our settings
    this.settings = settings[0]
  }


  registerRoutes() {

    // Views
    this.server.get( '/admin', this.checkIfAdmin, this.renderPage.bind( this ) )

    // API
    this.server.get( '/api/admin/users', this.checkIfAdmin, this.sendAllUsers.bind( this ) )
    this.server.post( '/api/admin/settings', this.checkIfAdmin, this.changeSettings.bind( this ) )
  }


  checkIfAdmin( req, res, next ) {

    if ( req.user && req.user.isAdmin ) {
      next()
    } else {
      res.status(401).send({ message: 'You are not allowed to do that' })
    }
  }


  async fetchAllUsers() {

    const users = await UserModel.find()

    return users
  }


  async sendAllUsers( req, res ) {

    const users = await this.fetchAllUsers()

    res.send( users )
  }


  async renderPage( req, res ) {

    const users = await this.fetchAllUsers()
    const queryParams = { users }

    this.app.render( req, res, req.url, queryParams )
  }


  async assignSettings( res ) {

    // Get the new settings
    const settings = await SettingsModel.findById( this.settings._id )

    // Assign settings to this object
    this.settings = settings

    // Assign new settings to res.locals
    res.locals.settings = this.settings

    return this.settings
  }


  async changeSettings( req, res ) {

    // Update the settings document in the db
    const settingsDocument = { _id: this.settings._id }
    await SettingsModel.findOneAndUpdate( settingsDocument, req.body )

    // Update settings within the app
    const settings = await this.assignSettings( res )

    res.send( settings )
  }
}


module.exports = AdminRoutes
