import { expect } from 'chai'
import mongoose from 'mongoose'
import keys from '../../../src/config/keys'
import Mailer from '../../../src/utilities/mailer'
import Post from '../../../src/models/post'

describe('mailer', () => {
  it('has the correct properties when constructed', () => {
    const mailer = new Mailer()
    expect(mailer.templateTag).to.be.a('string')
  })

  describe('getAccessToken()', () => {
    it('retrieves an access token', async () => {
      const mailer = new Mailer()
      const accessToken = await mailer.getAccessToken()
      expect(accessToken).to.be.a('string')
    }).timeout(5000)
  })

  describe('readHTMLFile()', () => {
    it('gets a string from an html template file', async () => {
      const mailer = new Mailer()
      const html = await mailer.readHTMLFile('src/emails/plain.html')

      expect(html).to.be.a('string') &&
      expect(html).to.equal('<p style="white-space: pre-wrap;">{{message}}</p>')
    })
  })

  describe('createTransporter()', () => {
    it('returns an email transporter', async () => {
      const mailer = new Mailer()
      const transporter = await mailer.createTransporter()

      expect(transporter.constructor.name).to.equal('Mail')
    }).timeout(5000)
  })

  describe('getEmailTemplateByTag()', () => {
    it('returns a post if there is an email template with the passed tag', async () => {
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      await mongoose.connect(keys.mongoURI, mongooseConfig)

      const mailer = new Mailer()
      const template = await mailer.getEmailTemplateByTag('welcome')

      expect(template).to.exist &&
      expect(template.tags).to.include('welcome') &&
      expect(template.tags).to.include(mailer.templateTag)
    })

    it('returns null if there is no email template with the passed tag', async () => {
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      await mongoose.connect(keys.mongoURI, mongooseConfig)

      const mailer = new Mailer()
      const template = await mailer.getEmailTemplateByTag('fart')

      expect(template).to.equal(null)
    })
  })

  describe('sendEmail()', () => {
    it('does not send an email if it could not find a template', async () => {
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      await mongoose.connect(keys.mongoURI, mongooseConfig)

      const mailer = new Mailer()
      const variables = { firstName: 'Scoob' }
      const recipient = keys.adminEmail
      const templateName = 'fart'

      const sent = await mailer.sendEmail(variables, recipient, templateName)

      expect(sent).to.equal(false)
    })

    it('sends an email', async () => {
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      await mongoose.connect(keys.mongoURI, mongooseConfig)

      const mailer = new Mailer()
      const variables = { firstName: 'Scoob' }
      const recipient = keys.adminEmail
      const templateName = 'welcome'

      const sent = await mailer.sendEmail(variables, recipient, templateName)

      expect(sent).to.equal(true)
    }).timeout(20000) // Sometimes sending an email takes a little longer
  })

  describe('sendBulkEmail()', () => {
    it('sends an email to all subscribed users', async () => {
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      await mongoose.connect(keys.mongoURI, mongooseConfig)

      const post = new Post({
        title: 'Mocha Test Post',
        content: 'This is some test post content.',
        tags: 'test, post',
        published: true,
        mainMedia: 'some-picture.jpg'
      })

      const mailer = new Mailer()
      const sent = await mailer.sendBulkEmail(post)

      expect(post).to.exist &&
      expect(sent).to.equal(true)
    }).timeout(20000) // Sometimes sending an email takes a little longer
  })
})
