import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import handlebars from 'handlebars'
import fs from 'fs'
import PostModel from '../models/post'
import UserModel from '../models/user'
import keys from '../config/keys'
const OAuth2 = google.auth.OAuth2


class Mailer {

  constructor() {

    this.templateTag = 'email-template'
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


  createTransporter() {

    return nodemailer.createTransport({
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
  }


  async getEmailTemplateByTag(tag) {

    // Get all published posts
    const posts = await PostModel.find({ published: true })

    let template = null

    // Find the first post with the corresponding tag and template tag
    for (const post of posts) {
      if ( post.tags.includes(this.templateTag) && post.tags.includes(tag)) {
        template = post
        break
      }
    }

    // Return the post or null
    return template
  }


  async sendBulkEmail(post) {

    const subscribedUsers = await UserModel.find({ isSubscribed: true })

    // Create an email transporter
    const transporter = this.createTransporter()

    for (const user of subscribedUsers) {

      const mailOptions = {
        from: keys.siteEmail,
        to: user.email,
        subject: post.title,
        generateTextFromHTML: true,
        html: post.content
      }

      await transporter.sendMail(mailOptions)
    }

    transporter.close()
  }


  async sendEmail(variables, recipient, templateName, subject = null) {

    // Instantiate sent. This will change when the email gets sent
    let sent = false
    let html = ''
    let emailSubject = ''

    // First search for a post with a tag that matches the template name
    let emailTemplatePost = await this.getEmailTemplateByTag(templateName)

    // If we found a post
    if (emailTemplatePost) {

      html = emailTemplatePost.content
      emailSubject = handlebars.compile(emailTemplatePost.title)(variables)

    // If we did not find a custom post, we'll use our static html file
    } else {

      // Read the file with the template name
      try {
        html = await this.readHTMLFile(`emails/${templateName}.html`)
        emailSubject = subject
      } catch (e) {
        console.error('There was an error getting the HTML file', e)
        return false
      }
    }

    // Fill in the variables to the template
    const template = handlebars.compile(html)
    const htmlToSend = template(variables)

    // Create an email transporter
    const transporter = this.createTransporter()

    const mailOptions = {
      from: keys.siteEmail,
      to: recipient,
      subject: emailSubject,
      generateTextFromHTML: true,
      html: htmlToSend
    }

    const response = await transporter.sendMail(mailOptions)
    transporter.close()

    if (response) {
      sent = true
    }

    return sent
  }


  async readHTMLFile(path) {

    return await fs.readFileSync(path, { encoding: 'utf-8' })
  }
}

export default Mailer
