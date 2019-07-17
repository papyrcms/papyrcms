const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
var handlebars = require('handlebars')
var fs = require('fs')
const keys = require('../config/keys')


class Mailer {

  constructor() {

    this.accessToken

    const oauth2Client = new OAuth2(
      keys.gmailClientId,
      keys.gmailClientSecret,
      "https://developers.google.com/oauthplayground"
    )

    oauth2Client.setCredentials({
      refresh_token: keys.gmailRefreshToken
    })

    oauth2Client.getAccessToken()
      .then(response => this.accessToken = response.token)
      .catch(error => console.error('error', error))
  }


  async sendEmail(model, templatePath, recipient, subject) {

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: keys.siteEmail,
        clientId: keys.gmailClientId,
        clientSecret: keys.gmailClientSecret,
        refreshToken: keys.gmailRefreshToken,
        accessToken: this.accessToken
      }
    })

    let sent

    this.readHTMLFile(templatePath, (err, html) => {

      if (err) {
        return false
      }

      const template = handlebars.compile(html)
      const htmlToSend = template(model)

      const mailOptions = {
        from: keys.siteEmail,
        to: recipient,
        subject,
        generateTextFromHTML: true,
        html: htmlToSend
      }

      transporter.sendMail(mailOptions, (error, response) => {

        if (error) {
          sent = false
        }

        if (response) {
          sent = true
        }

        transporter.close()
      })
    })

    return sent
  }


  readHTMLFile(path, callback) {

    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
      if (err) {
        callback(err)
      }
      else {
        callback(null, html)
      }
    })
  }
}

module.exports = Mailer
