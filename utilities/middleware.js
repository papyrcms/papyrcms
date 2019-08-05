const _ = require('lodash')
const sanitizeHTML = require('sanitize-html')

const checkIfAdmin = (req, res, next) => {

  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401).send({ message: 'You are not allowed to do that' })
  }
}


const mapTagsToArray = (req, res, next) => {

  if (req.body.tags) {
    const newTags = _.map(req.body.tags.split(','), tag => {
      let pendingTag = tag
      pendingTag = pendingTag.trim()
  
      if (!!pendingTag) {
        return pendingTag
      }
    })
  
    req.body.tags = newTags
  }
  
  next()
}


const sanitizeRequestBody = (req, res, next) => {

  // Santize inputs
  _.map(req.body, (value, key) => {
    req.body[key] = sanitizeHTML(value)
  })

  next()
}

module.exports = { checkIfAdmin, mapTagsToArray, sanitizeRequestBody }