import { expect } from "chai"
import axios from 'axios'
import keys from '../../../src/config/keys'
const { test, rootURL, googleAnalyticsId, googleMapsKey, stripePublishableKey } = keys


const axiosConfig = {
  withCredentials: true,
  headers: {
    Authorization: `bearer ${test.token}`
  }
}


describe("/api/utility", () => {

  describe("/publicKeys", () => {
    it("returns the ananlytics id, maps kye, and stripe pub key", async () => {
      const { data: publicKeys } = await axios.post(`${rootURL}/api/utility/publicKeys`)
      const { googleAnalyticsId, googleMapsKey, stripePubKey } = publicKeys

      expect(publicKeys).to.exist &&
      expect(googleAnalyticsId).to.be.a('string') &&
      expect(googleMapsKey).to.be.a('string') &&
      expect(stripePubKey).to.be.a('string')
    })
  })

  describe("/settings", () => {
    const expectedSettings = {
      enableMenu: true,
      enableRegistration: true,
      enableBlog: false,
      enableCommenting: false,
      enableEmailingToAdmin: false,
      enableEmailingToUsers: false,
      enableEvents: false,
      enableStore: false
    }

    it("returns the settings that were posted", async () => {
      const { data: settings } = await axios.post(`${rootURL}/api/utility/settings`, expectedSettings, axiosConfig)
      expect(settings).to.eql(expectedSettings)
    })

    it("will only allow settings to be posted by admin users", async () => {
      try {
        await axios.post(`${rootURL}/api/utility/settings`)
      } catch (err) {
        expect(err.response.status).to.equal(403)
      }
    })

    it("gets the correct settings", async () => {
      const { data: settings } = await axios.get(`${rootURL}/api/utility/settings`)
      expect(settings).to.eql(expectedSettings)
    })
  })

  describe('/donate', () => {
    // I don't know how to create a test card programatically currently
  })
})
