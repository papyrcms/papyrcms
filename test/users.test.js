import { expect } from 'chai'
import axios from 'axios'
import mongoose from 'mongoose'
import keys from '../src/config/keys'
import User from '../src/models/user'
const { rootURL, test } = keys


const axiosConfig = {
  withCredentials: true,
  headers: {
    Cookie: test.cookie
  }
}


describe('/api/users', async () => {
  describe('/[id]', () => {
    it('does not delete a user if the request was sent by a non-admin', () => {
      setTimeout(async () => {
        const mongooseConfig = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true
        }
        await mongoose.connect(keys.mongoURI, mongooseConfig)
        const testUser = await User.findOne({ email: 'test@test.com' })

        try {
          await axios.delete(`${rootURL}/api/users/${testUser._id}`)
        } catch (err) {
          expect(err.response.status).to.equal(403)
        }
      }, 3000)
    })

    it('deletes a user', () => {
      setTimeout(async () => {
        const mongooseConfig = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true
        }
        await mongoose.connect(keys.mongoURI, mongooseConfig)
        const testUser = await User.findOne({ email: 'test@test.com' })

        const response = await axios.delete(`${rootURL}/api/users/${testUser._id}`, axiosConfig)
        const deletedUser = await User.findOne({ email: 'test@test.com' })

        expect(response.data.message).to.equal('user deleted') &&
        expect(deletedUser).to.equal(null)
      }, 3000)
    })
  })
})