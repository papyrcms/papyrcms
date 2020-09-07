import { expect } from 'chai'
import axios from 'axios'
import keys from '../../config/keys'
const { rootURL, test } = keys

const axiosConfig = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${test.token}`,
  },
}

describe('/api/messages', () => {
  it('creates and returns a message', async () => {
    const message = {
      name: 'Scooby Doo',
      email: 'scoob@gmail.com',
      message: 'Ruh Roh',
    }
    const { data: created, status } = await axios.post(
      `${rootURL}/api/messages`,
      message,
      axiosConfig
    )

    expect(status).to.equal(200) &&
      expect(created.name).to.equal(message.name) &&
      expect(created.email).to.equal(message.email) &&
      expect(created.message).to.equal(message.message)
  }).timeout(10000)

  it('returns an array of messages', async () => {
    const { data: messages, status } = await axios.get(
      `${rootURL}/api/messages`,
      axiosConfig
    )
    expect(status).to.equal(200) && expect(messages).to.be.an('array')
  }).timeout(10000)

  describe('/[id]', () => {
    it('returns a success response when deleting a message', async () => {
      const { data: messages } = await axios.get(
        `${rootURL}/api/messages`,
        axiosConfig
      )
      const [message] = messages
      const { status } = await axios.delete(
        `${rootURL}/api/messages/${message._id}`,
        axiosConfig
      )
      expect(status).to.equal(200)
    }).timeout(10000)
  })
})
