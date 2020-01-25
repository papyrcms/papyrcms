import { expect } from "chai"
import axios from 'axios'
import keys from '../src/config/keys'
const { test, rootURL, googleAnalyticsId, googleMapsKey, stripePublishableTestKey } = keys


const axiosConfig = {
  withCredentials: true,
  headers: {
    Cookie: test.cookie
  }
}


describe("/api/utility", () => {
  describe("/googleAnalyticsId", () => {
    it("returns the correct id", async () => {
      const { data: id } = await axios.post(`${rootURL}/api/utility/googleAnalyticsId`)
      expect(id).to.equal(googleAnalyticsId)
    })
  })

  describe("/googleMapsKey", () => {
    it("returns the correct id", async () => {
      const { data: id } = await axios.post(`${rootURL}/api/utility/googleMapsKey`)
      expect(id).to.equal(googleMapsKey)
    })
  })

  describe("/stripePubKey", () => {
    it("returns the correct id", async () => {
      const { data: id } = await axios.post(`${rootURL}/api/utility/stripePubKey`)
      expect(id).to.equal(stripePublishableTestKey)
    })
  })

  describe("/settings", () => {
    const expectedSettings = {
      enableMenu: true,
      enableRegistration: true,
      enableBlog: false,
      enableCommenting: false,
      enableEmailingToAdmin: true,
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
})
