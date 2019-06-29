const _ = require('lodash')
const sanitizeHTML = require('sanitize-html')
const Settings = require('../models/settings')

const configureSettings = (req, res, next) => {

  // Configure app settings
  let appSettings

  // Search for a settings document
  Settings.find().exec((error, settings) => {

    if (error) {
      console.error(error)
    }

    // We only EVER want ONE settings document
    // If no document exists, create one and rerun function
    if (settings.length === 0) {
      appSettings = new Settings()
      appSettings.save()
      console.log('New settings document created')

      // Give mongo time to save the document 
      // before running the funciton again
      // to prevent creating a duplicate settings document
      setTimeout(() => {}, 3000)
    } else {
      appSettings = settings[0]
    }

    res.locals.settings = appSettings

    next()
  }) // End callback
}


const checkIfAdmin = (req, res, next) => {

  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401).send({ message: 'You are not allowed to do that' })
  }
}


const sanitizeRequestBody = (req, res, next) => {

  // Santize inputs
  _.map(req.body, (input) => {
    req.body[input] = sanitizeHTML(input)
  })

  next()
}

module.exports = { configureSettings, checkIfAdmin, sanitizeRequestBody }