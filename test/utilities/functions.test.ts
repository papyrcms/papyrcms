import { expect } from 'chai'
import mongoose from 'mongoose'
import keys from '../../src/config/keys'
import { configureSettings } from '../../src/utilities/functions'
import Settings from '../../src/models/settings'


describe('utility functions', () => {
  describe('configureSettings(name, defaultOptions)', () => {
    it('returns the passed test settings object', async () => {
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      await mongoose.connect(keys.mongoURI, mongooseConfig)

      const testSettings = { testOption1: true, testOption2: false }
      const savedSettings = await configureSettings("test", testSettings)

      expect(savedSettings).to.eql(testSettings)
    })

    it('saved the test settings to the database', async () => {
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      await mongoose.connect(keys.mongoURI, mongooseConfig)

      const testSettings = { testOption1: true, testOption2: false }

      const foundSettings = await Settings.findOne({ name: 'test' }).lean()

      expect(foundSettings.name).to.equal('test') &&
      expect(foundSettings.options).to.eql(testSettings)
    })
  })
})