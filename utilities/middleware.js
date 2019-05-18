const _ = require('lodash')
const sanitizeHTML = require('sanitize-html')

const checkIfAdmin = (req, res, next) => {

  const { currentUser } = res.locals

  if (currentUser && currentUser.isAdmin) {
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

module.exports = { checkIfAdmin, sanitizeRequestBody }