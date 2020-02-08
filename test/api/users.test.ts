import { expect } from 'chai'
import axios from 'axios'
import mongoose from 'mongoose'
import keys from '../../src/config/keys'
import User from '../../src/models/user'
const { mongoURI, rootURL, test, adminEmail } = keys


const axiosConfig = {
  withCredentials: true,
  headers: {
    Authorization: `bearer ${test.token}`
  }
}


describe('/api/users', () => {
  it('returns a list of users', async () => {
    const { data: users } = await axios.get(`${rootURL}/api/users`, axiosConfig)
    expect(users).to.be.an('array')
  })

  describe('/makeAdmin', () => {
    it('makes a non-admin user an admin', async () => {
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      await mongoose.connect(mongoURI, mongooseConfig)
      const testUser = await User.findOne({ email: 'test@test.com' })

      const putData = { userId: testUser._id, isAdmin: true }
      const { status } = await axios.put(`${rootURL}/api/users/makeAdmin`, putData, axiosConfig)
      const updatedUser = await User.findOne({ email: 'test@test.com' })

      expect(status).to.equal(200) &&
      expect(updatedUser.isAdmin).to.equal(true)
    })

    it('make an admin user into a non-admin', async () => {
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      await mongoose.connect(mongoURI, mongooseConfig)
      const testUser = await User.findOne({ email: 'test@test.com' })

      const putData = { userId: testUser._id, isAdmin: false }
      const { status } = await axios.put(`${rootURL}/api/users/makeAdmin`, putData, axiosConfig)
      const updatedUser = await User.findOne({ email: 'test@test.com' })

      expect(status).to.equal(200) &&
      expect(updatedUser.isAdmin).to.equal(false)
    })
  })

  describe('/ban', () => {
    it('makes a non-banned user an banned', async () => {
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      await mongoose.connect(mongoURI, mongooseConfig)
      const testUser = await User.findOne({ email: 'test@test.com' })

      const putData = { userId: testUser._id, isBanned: true }
      const { status } = await axios.put(`${rootURL}/api/users/ban`, putData, axiosConfig)
      const updatedUser = await User.findOne({ email: 'test@test.com' })

      expect(status).to.equal(200) &&
      expect(updatedUser.isBanned).to.equal(true)
    })

    it('make a banned user into a non-banned', async () => {
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      await mongoose.connect(mongoURI, mongooseConfig)
      const testUser = await User.findOne({ email: 'test@test.com' })

      const putData = { userId: testUser._id, isBanned: false }
      const { status } = await axios.put(`${rootURL}/api/users/ban`, putData, axiosConfig)
      const updatedUser = await User.findOne({ email: 'test@test.com' })

      expect(status).to.equal(200) &&
      expect(updatedUser.isBanned).to.equal(false)
    })
  })

  describe('/[id]', () => {
    it('does not delete a user if the request was sent by a non-admin', async () => {
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      await mongoose.connect(mongoURI, mongooseConfig)
      const testUser = await User.findOne({ email: 'test@test.com' })

      try {
        await axios.delete(`${rootURL}/api/users/${testUser._id}`)
      } catch (err) {
        expect(err.response.status).to.equal(403)
      }
    })

    it('does not delete the user who sent the request', async () => {
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      await mongoose.connect(mongoURI, mongooseConfig)
      const adminUser = await User.findOne({ email: adminEmail })

      try {
        await axios.delete(`${rootURL}/api/users/${adminUser._id}`, axiosConfig)
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('deletes a user', async () => {
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      await mongoose.connect(mongoURI, mongooseConfig)
      const testUser = await User.findOne({ email: 'test@test.com' })

      const response = await axios.delete(`${rootURL}/api/users/${testUser._id}`, axiosConfig)
      const deletedUser = await User.findOne({ email: 'test@test.com' })

      expect(response.data.message).to.equal('user deleted') &&
      expect(deletedUser).to.equal(null)
    })
  })
})