const jwt = require('jsonwebtoken')
const Controller = require('./abstractController')
const UserModel = require('../models/user')
const Mailer = require('../utilities/mailer')
const passport = require('passport')
const { sanitizeRequestBody, checkIfAdmin, checkIfBanned } = require('../utilities/middleware')
const { configureSettings } = require('../utilities/functions')
const keys = require('../config/keys')


class AuthController extends Controller {

  registerSettings() {

    // Middleware to configure auth settings
    this.server.use(async (req, res, next) => {

      const defaultSettings = { enableRegistration: true }
      const settings = await configureSettings('auth', defaultSettings)

      Object.keys(settings).forEach(optionKey => {
        const optionValue = settings[optionKey]

        res.locals.settings[optionKey] = optionValue
      })
      next()
    })
  }


  registerRoutes() {

    // Views
    this.server.get(
      '/login',
      this.renderPage.bind(this)
    )
    this.server.get(
      '/profile',
      this.renderPage.bind(this)
    )
    this.server.get(
      '/forgot_password',
      this.verifyJWT,
      this.renderPage.bind(this)
    )

    // API
    this.server.post(
      '/api/register',
      this.allowRegisterUser,
      this.registerUser.bind(this)
    )
    this.server.post(
      '/api/login',
      sanitizeRequestBody,
      passport.authenticate('local', {}),
      checkIfBanned,
      this.sendCurrentUser.bind(this)
    )
    this.server.get(
      '/api/currentUser',
      this.sendCurrentUser.bind(this)
    )
    this.server.put(
      '/api/currentUser',
      sanitizeRequestBody,
      this.updateCurrentUser.bind(this)
    )
    this.server.put(
      '/api/user/makeAdmin',
      sanitizeRequestBody,
      checkIfAdmin,
      this.makeAdmin.bind(this)
    )
    this.server.put(
      '/api/user/ban',
      sanitizeRequestBody,
      checkIfAdmin,
      this.banUser.bind(this)
    )
    this.server.post(
      '/api/changePassword',
      sanitizeRequestBody,
      this.changeUserPassword.bind(this)
    )
    this.server.post(
      '/api/changeForgottenPassword',
      sanitizeRequestBody,
      this.changeForgottenPassword.bind(this)
    )
    this.server.post(
      '/api/forgotPassword',
      sanitizeRequestBody,
      this.sendForgotPasswordEmail.bind(this)
    )
    this.server.get(
      '/api/logout',
      this.logoutUser.bind(this)
    )
    this.server.get(
      '/api/users',
      checkIfAdmin,
      this.sendAllUsers.bind(this)
    )
    this.server.delete(
      '/api/user/:id',
      checkIfAdmin,
      this.deleteUser.bind(this)
    )
  }


  verifyJWT(req, res, next) {

    try {
      if (jwt.verify(req.query.token, keys.jwtSecret)) {
        next()
      } else {
        res.status(400).send({ message: 'You\'re not allowed to do that.' })
      }
    } catch(exception) {
      res.status(400).send({ message: 'You\'re not allowed to do that.' })
    }
  }


  async deleteUser(req, res) {

    const { id } = req.params

    if (id === req.user._id) {
      return res.status(400).send({ message: 'You cannot delete yourself.' })
    }

    await UserModel.findOneAndDelete({ _id: id })

    res.send({ message: 'User deleted' })
  }


  allowRegisterUser(req, res, next) {

    if (res.locals.settings.enableRegistration) {
      next()
    } else {
      res.status(400).send({ message: 'You\'re not allowed to do that.' })
    }
  }


  renderPage(req, res) {

    this.app.render(req, res, req.route.path)
  }


  async sendAllUsers(req, res) {

    const users = await UserModel.find()

    res.send(users)
  }


  sendCurrentUser(req, res) {

    res.send(req.user)
  }


  verifyEmailSyntax(email) {

    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(String(email).toLowerCase())
  }


  registerUser(req, res) {

    const { firstName, lastName, email, password, passwordConfirm } = req.body

    if (!firstName || firstName === '') {
      return res.status(400).send({ message: 'Please enter your first name' })
    }

    if (!lastName || lastName === '') {
      return res.status(400).send({ message: 'Please enter your last name' })
    }

    // Make sure email is in email format
    if (!this.verifyEmailSyntax(email)) {
      return res.status(400).send({ message: 'Please use a valid email address' })
    }

    // Make sure password fields match
    if (password !== passwordConfirm) {
      return res.status(400).send({ message: 'The password fields need to match' })
    }

    // The LocalStrategy module requires a username
    // Set username and email as the user's email
    const newUser = new UserModel({
      username: email, email, firstName, lastName
    })

    UserModel.register(newUser, password, err => {
      if (err) {
        err.message = err.message.replace('username', 'email')
        res.send({ error: err })
      }

      passport.authenticate('local')(req, res, async () => {

        const mailer = new Mailer()
        const subject = `Welcome, ${newUser.firstName}!`

        if (res.locals.settings.enableEmailingToUsers) {
          await mailer.sendEmail(newUser, newUser.email, 'welcome', subject)
        }

        res.send('success')
      })
    })
  }


  async updateCurrentUser(req, res) {

    const {
      userId, firstName, lastName, email,
      address1, address2, city, state, zip, country,
      shippingFirstName, shippingLastName, shippingEmail,
      shippingAddress1, shippingAddress2, shippingCity,
      shippingState, shippingZip, shippingCountry
    } = req.body

    // Make sure the user submitting the form is the logged in on the server
    if (userId.toString() !== req.user._id.toString()) {
      const message = 'There\'s a problem with your session. Try logging out and logging back in'
      return res.status(400).send({ message })
    }

    // Make sure a user with the email does not already exist
    const existingUser = await UserModel.findOne({ email })
    if (existingUser && !existingUser._id.equals(req.user._id)) {
      const message = 'Someone is already using this email.'
      return res.status(400).send({ message })
    }

    // Update user data
    const newUserData = {
      firstName, lastName, email, address1,
      address2, city, state, zip, country,
      shippingFirstName, shippingLastName, shippingEmail,
      shippingAddress1, shippingAddress2, shippingCity,
      shippingState, shippingZip, shippingCountry
    }
    const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, newUserData)

    res.send(updatedUser)
  }


  changeUserPassword(req, res) {

    const { oldPass, newPass, confirmPass, userId } = req.body

    // Make sure password fields are filled out
    if (!oldPass) {
      return res.status(400).send({ message: 'You need to fill in your current password.' })
    } else if (!newPass) {
      return res.status(400).send({ message: 'You need to fill in your new password.' })
    }

    UserModel.findById(userId, (err, foundUser) => {
      if (!!foundUser) {
        // Make sure the entered password is the user's password
        foundUser.authenticate(oldPass, (err, user, passwordError) => {
          if (!!user) {
            // Check to see new password fields match
            if (newPass !== confirmPass) {
              return res.status(400).send({ message: 'The new password fields do not match.' })
            } else {
              // Set the new password
              foundUser.setPassword(newPass, () => {
                foundUser.save()
                res.send({ message: 'Your password has been saved!' })
              })
            }
          } else if (!!err) {
            return res.status(400).send(err)
          } else if (!!passwordError) {
            return res.status(400).send({ message: 'You have entered the wrong current password.' })
          }
        })
      } else {
        return res.status(400).send(err)
      }
    })
  }


  async changeForgottenPassword(req, res) {

    try {

      const { token, password, confirmPassword } = req.body

      const data = jwt.verify(token, keys.jwtSecret)

      if (password !== confirmPassword) {
        res.status(400).send({ message: 'The new password fields do not match.' })
      }

      const foundUser = await UserModel.findOne({ email: data.email })

      // Set the new password
      foundUser.setPassword(password, () => {
        foundUser.save()
        res.send({ message: 'Your password has been saved!' })
      })

    } catch (e) {
      res.status(400).send(err)
    }
  }


  async sendForgotPasswordEmail(req, res) {

    if (res.locals.settings.enableEmailingToUsers) {

      const { email } = req.body

      if (!this.verifyEmailSyntax(email)) {
        res.status(400).send({ message: 'Please enter your email address.' })
      }

      const userExists = await UserModel.findOne({ email })
      if (!userExists) {

        let message = 'That email does not exist in our system.'

        if (res.locals.settings.enableRegistration) {
          message = message + ' Try filling out the "Register" form.'
        }

        return res.status(400).send({ message })
      }

      const mailer = new Mailer()
      const subject = "Forgot your password?"
      const variables = {
        website: keys.rootURL,
        token: jwt.sign({ email }, keys.jwtSecret)
      }

      mailer.sendEmail(variables, email, 'forgot-password', subject)
      res.send({ message: 'Your email is on its way!' })
    } else {
      res.status(400).send({ message: 'Looks like emailing is disabled. Please contact a site administrator to reset your password.' })
    }
  }


  async makeAdmin(req, res) {

    const { userId, isAdmin } = req.body

    await UserModel.findByIdAndUpdate(userId, { isAdmin })

    res.send({ message: 'Success' })
  }


  async banUser(req, res) {

    const { userId, isBanned } = req.body

    await UserModel.findByIdAndUpdate(userId, { isBanned })

    res.send({ message: 'Success' })
  }


  logoutUser(req, res) {

    req.logout()

    res.send('logged out')
  }
}


module.exports = AuthController
