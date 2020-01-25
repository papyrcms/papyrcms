import { expect } from 'chai'
import axios from 'axios'
import keys from '../src/config/keys'
const { rootURL, test } = keys


const axiosConfig = {
  withCredentials: true,
  headers: {
    Cookie: test.cookie
  }
}


describe('/api/auth', () => {
  describe('/currentUser', () => {
    it('returns the current user', async () => {
      const { data: user } = await axios.get(`${rootURL}/api/auth/currentUser`, axiosConfig)
      expect(user.email).to.equal("drkgrntt@gmail.com") &&
      expect(user.firstName).to.equal('Derek') &&
      expect(user.lastName).to.equal('Garnett')
    })
  })

  const newUser = {
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'abcd1234',
    passwordConfirm: 'abcd1234'
  }

  describe('/register', () => {
    it('does not create a user if the passwords do not match', async () => {
      try {
        await axios.post(`${rootURL}/api/auth/register`, { ...newUser, passwordConfirm: 'notamatch' })
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('does not create a user if there is no firstName', async () => {
      try {
        await axios.post(`${rootURL}/api/auth/register`, { ...newUser, firstName: '' })
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('does not create a user if there is no lastName', async () => {
      try {
        await axios.post(`${rootURL}/api/auth/register`, { ...newUser, lastName: '' })
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('does not create a user if the email is invalid', async () => {
      try {
        await axios.post(`${rootURL}/api/auth/register`, { ...newUser, email: 'invalidEmail' })
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('creates a user', async () => {
      const { data: created } = await axios.post(`${rootURL}/api/auth/register`, newUser)
      expect(newUser.email).to.equal(created.email) &&
      expect(newUser.firstName).to.equal(created.firstName) &&
      expect(newUser.lastName).to.equal(created.lastName)
    })

    it('does not create a user if the user already exists', async () => {
      try {
        await axios.post(`${rootURL}/api/auth/register`, newUser)
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })
  })

  describe('/login', () => {
    it('returns the authenticated user', async () => {
      const { data: foundUser } = await axios.post(`${rootURL}/api/auth/login`, { email: newUser.email, password: newUser.password })
      expect(newUser.email).to.equal(foundUser.email) &&
      expect(newUser.firstName).to.equal(foundUser.firstName) &&
      expect(newUser.lastName).to.equal(foundUser.lastName)
    })

    it('throws an error if the user does not exist', async () => {
      try {
        await axios.post(`${rootURL}/api/auth/login`, { email: 'abcd@abcd.com', password: 'invalid' })
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('throws an error if the password is wrong', async () => {
      try {
        await axios.post(`${rootURL}/api/auth/login`, { email: newUser.email, password: 'invalid' })
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })
  })

  describe('/changePassword', () => {
    it('returns a success message if the password is successfully changed', async () => {
      const data = {
        oldPass: test.oldPass,
        newPass: test.newPass,
        confirmPass: test.newPass
      }
      const { data: response } = await axios.post(`${rootURL}/api/auth/changePassword`, data, axiosConfig)
      expect(response.message).to.equal('Your password has been saved!')
    })

    it('returns an error if there is no old password', async () => {
      const data = {
        oldPass: '',
        newPass: test.newPass,
        confirmPass: test.newPass
      }
      try {
        await axios.post(`${rootURL}/api/auth/changePassword`, data, axiosConfig)
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('returns an error if the old password is incorrect', async () => {
      const data = {
        oldPass: 'someIncorrectPassword',
        newPass: test.newPass,
        confirmPass: test.newPass
      }
      try {
        await axios.post(`${rootURL}/api/auth/changePassword`, data, axiosConfig)
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('returns an error if there is no new password', async () => {
      const data = {
        oldPass: test.oldPass,
        newPass: '',
        confirmPass: test.newPass
      }
      try {
        await axios.post(`${rootURL}/api/auth/changePassword`, data, axiosConfig)
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('returns an error if the new and old passwords do not match', async () => {
      const data = {
        oldPass: test.oldPass,
        newPass: test.newPass,
        confirmPass: ''
      }
      try {
        await axios.post(`${rootURL}/api/auth/changePassword`, data, axiosConfig)
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })
  })

  describe('/forgotPassword', () => {
    
  })
})
