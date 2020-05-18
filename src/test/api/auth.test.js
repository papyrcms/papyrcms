import { expect } from 'chai'
import axios from 'axios'
import keys from '../../../src/config/keys'
const { rootURL, test } = keys


const axiosConfig = {
  withCredentials: true,
  headers: {
    Authorization: `bearer ${test.token}`
  }
}


describe('/api/auth', () => {
  describe('/currentUser', () => {
    it('returns the current user', async () => {
      const { data: user } = await axios.get(`${rootURL}/api/auth/currentUser`, axiosConfig)
      expect(user.email).to.be.a('string') &&
      expect(user.firstName).to.be.a('string') &&
      expect(user.lastName).to.be.a('string')
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
        // Fail if we made it here.
        expect(true).to.equal(false)
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('does not create a user if there is no firstName', async () => {
      try {
        await axios.post(`${rootURL}/api/auth/register`, { ...newUser, firstName: '' })
        // Fail if we made it here.
        expect(true).to.equal(false)
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('does not create a user if there is no lastName', async () => {
      try {
        await axios.post(`${rootURL}/api/auth/register`, { ...newUser, lastName: '' })
        // Fail if we made it here.
        expect(true).to.equal(false)
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('does not create a user if the email is invalid', async () => {
      try {
        await axios.post(`${rootURL}/api/auth/register`, { ...newUser, email: 'invalidEmail' })
        // Fail if we made it here.
        expect(true).to.equal(false)
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('creates a user', async () => {
      const { data: created } = await axios.post(`${rootURL}/api/auth/register`, newUser)
      expect(newUser.email).to.equal(created.user.email) &&
      expect(newUser.firstName).to.equal(created.user.firstName) &&
      expect(newUser.lastName).to.equal(created.user.lastName)
    })

    it('does not create a user if the user already exists', async () => {
      try {
        await axios.post(`${rootURL}/api/auth/register`, newUser)
        // Fail if we made it here.
        expect(true).to.equal(false)
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })
  })

  describe('/login', () => {
    it('returns the authenticated user', async () => {
      const { data: foundUser } = await axios.post(`${rootURL}/api/auth/login`, { email: newUser.email, password: newUser.password })
      expect(newUser.email).to.equal(foundUser.user.email) &&
      expect(newUser.firstName).to.equal(foundUser.user.firstName) &&
      expect(newUser.lastName).to.equal(foundUser.user.lastName)
    })

    it('throws an error if the user does not exist', async () => {
      try {
        await axios.post(`${rootURL}/api/auth/login`, { email: 'abcd@abcd.com', password: 'invalid' })
      } catch (err) {
        expect(err.response.status).to.equal(400)
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
    it('returns an error if the password is not a valid email', async () => {
      // Set emailing to users to true for the next 2 tests
      const expectedSettings = {
        enableMenu: true,
        enableRegistration: true,
        enableBlog: false,
        enableCommenting: false,
        enableEmailingToAdmin: false,
        enableEmailingToUsers: true,
        enableEvents: false,
        enableStore: false
      }
      await axios.post(`${rootURL}/api/utility/settings`, expectedSettings, axiosConfig)

      try {
        await axios.post(`${rootURL}/api/auth/forgotPassword`, { email: '' })
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('returns an error if the email is not in the system', async () => {
      try {
        await axios.post(`${rootURL}/api/auth/forgotPassword`, { email: 'tester@gmail.com' })
      } catch (err) {
        // disable emailing to users now that the tests are finished
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
        await axios.post(`${rootURL}/api/utility/settings`, expectedSettings, axiosConfig)

        expect(err.response.status).to.equal(401)
      }
    })
  })

  describe('/requestPasswordChange', () => {
    const data = {
      token: test.tokenRpc,
      password: test.newPass,
      confirmPassword: test.newPass
    }

    it('returns an error if the passwords do not match', async () => {
      try {
        await axios.post(`${rootURL}/api/auth/requestPasswordChange`, { ...data, confirmPassword: 'notamatch' })
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    })

    it('returns a success message if the password was successfully saved', async () => {
      const { status } = await axios.post(`${rootURL}/api/auth/requestPasswordChange`, data)
      expect(status).to.equal(200)
    })
  })

  describe('/logout', () => {
    it('returns a success message on logout', async () => {
      const { status } = await axios.get(`${rootURL}/api/auth/logout`)
      expect(status).to.equal(200)
    })
  })
})
