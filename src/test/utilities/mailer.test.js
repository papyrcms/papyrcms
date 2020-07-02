import { expect } from 'chai'
import keys from '../../config/keys'
import Mailer from '../../utilities/mailer'
import database from "../../utilities/serverContext/database"


describe('mailer', () => {
  it('has the correct properties when constructed', async () => {
    await database.init()
    const mailer = new Mailer(database)
    expect(mailer.templateTag).to.be.a('string') &&
    expect(mailer.database).to.exist
  }).timeout(10000)

  describe('getAccessToken()', () => {
    it('retrieves an access token', async () => {
      await database.init()
      const mailer = new Mailer(database)
      const accessToken = await mailer.getAccessToken()
      expect(accessToken).to.be.a('string')
    }).timeout(5000)
  })

  describe('readHTMLFile()', () => {
    it('gets a string from an html template file', async () => {
      await database.init()
      const mailer = new Mailer(database)
      const html = await mailer.readHTMLFile('src/emails/plain.html')

      expect(html).to.be.a('string') &&
      expect(html).to.equal('<p style="white-space: pre-wrap;">{{message}}</p>')
    }).timeout(10000)
  })

  describe('createTransporter()', () => {
    it('returns an email transporter', async () => {
      await database.init()
      const mailer = new Mailer(database)
      const transporter = await mailer.createTransporter()

      expect(transporter.constructor.name).to.equal('Mail')
    }).timeout(10000)
  })

  describe('getEmailTemplateByTag()', () => {
    it('returns a post if there is an email template with the passed tag', async () => {
      await database.init()
      const mailer = new Mailer(database)

      const template = await mailer.getEmailTemplateByTag('welcome')

      expect(template).to.exist &&
      expect(template.tags).to.include('welcome') &&
      expect(template.tags).to.include(mailer.templateTag)
    }).timeout(10000)

    it('returns null if there is no email template with the passed tag', async () => {
      await database.init()
      const mailer = new Mailer(database)

      const template = await mailer.getEmailTemplateByTag('fart')

      expect(template).to.equal(null)
    }).timeout(10000)
  })

  describe('sendEmail()', () => {
    it('does not send an email if it could not find a template', async () => {
      await database.init()
      const mailer = new Mailer(database)

      const variables = { firstName: 'Scoob' }
      const recipient = keys.adminEmail
      const templateName = 'fart'

      const sent = await mailer.sendEmail(variables, recipient, templateName)

      expect(sent).to.equal(false)
    }).timeout(10000)

    it('sends an email', async () => {
      await database.init()
      const mailer = new Mailer(database)

      const variables = { firstName: 'Scoob' }
      const recipient = keys.adminEmail
      const templateName = 'welcome'

      const sent = await mailer.sendEmail(variables, recipient, templateName)

      expect(sent).to.equal(true)
    }).timeout(20000) // Sometimes sending an email takes a little longer
  })

  describe('sendBulkEmail()', () => {
    it('sends an email to all subscribed users', async () => {
      await database.init()
      

      const { create, destroy, Post } = database
      const postData = {
        title: 'Mocha Test Post',
        content: 'This is some test post content.',
        tags: 'test, post',
        published: true,
        mainMedia: 'some-picture.jpg'
      }
      const post = await create(Post, postData)
      
      const mailer = new Mailer(database)
      const sent = await mailer.sendBulkEmail(post)

      await destroy(Post, { _id: post._id })

      expect(sent).to.equal(true)
    }).timeout(20000) // Sometimes sending an email takes a little longer
  })
})
