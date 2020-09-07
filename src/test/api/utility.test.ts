import { expect } from 'chai'
import axios from 'axios'
import keys from '../../config/keys'
const { adminEmail, test, rootURL } = keys

const axiosConfig = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${test.token}`,
  },
}

describe('/api/utility', () => {
  describe('/publicKeys', () => {
    it('returns the ananlytics id, maps key, and stripe pub key', async () => {
      const { data: publicKeys } = await axios.get(
        `${rootURL}/api/utility/publicKeys`
      )
      const {
        googleAnalyticsId,
        googleMapsKey,
        stripePublishableKey,
      } = publicKeys

      expect(publicKeys).to.exist &&
        expect(googleAnalyticsId).to.be.a('string') &&
        expect(googleMapsKey).to.be.a('string') &&
        expect(stripePublishableKey).to.be.a('string')
    }).timeout(10000)
  })

  describe('/settings', () => {
    const expectedSettings = {
      enableMenu: true,
      enableRegistration: true,
      enableBlog: true,
      enableCommenting: true,
      enableEmailingToAdmin: true,
      enableEmailingToUsers: true,
      enableEvents: true,
      enableStore: true,
    }

    it('returns the settings that were posted', async () => {
      const { data: settings } = await axios.post(
        `${rootURL}/api/utility/settings`,
        expectedSettings,
        axiosConfig
      )
      expect(settings).to.eql(expectedSettings)
    }).timeout(10000)

    it('will only allow settings to be posted by admin users', async () => {
      try {
        await axios.post(`${rootURL}/api/utility/settings`)
      } catch (err) {
        expect(err.response.status).to.equal(403)
      }
    }).timeout(10000)

    it('gets the correct settings', async () => {
      const { data: settings } = await axios.get(
        `${rootURL}/api/utility/settings`
      )
      expect(settings).to.eql(expectedSettings)
    }).timeout(10000)
  })

  describe('/donate', () => {
    it('makes a one-dollar donation', async () => {
      const info = {
        email: adminEmail,
        amount: 1,
        source: { id: 'tok_discover' },
      }
      const { data: charge } = await axios.post(
        `${rootURL}/api/utility/donate`,
        info
      )

      expect(charge).to.exist &&
        expect(charge.object).to.equal('charge') &&
        expect(charge.status).to.equal('succeeded') &&
        expect(charge.amount).to.equal(100)
    }).timeout(10000)
  })
})
