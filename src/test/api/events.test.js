import { expect } from 'chai'
import axios from 'axios'
import _ from 'lodash'
import keys from '@/keys'
const { rootURL, test } = keys


const axiosConfig = {
  withCredentials: true,
  headers: {
    Authorization: `bearer ${test.token}`
  }
}


const event = {
  title: 'Mocha Test Event',
  content: 'This is some test event content.',
  tags: 'test, event',
  published: true,
  mainMedia: 'some-picture.jpg',
  date: new Date('2024-03-01').toISOString(),
  latitude: 123,
  longitude: 321
}


describe('/api/events', () => {
  it('creates and returns an event', async () => {
    const { data: created, status } = await axios.post(`${rootURL}/api/events`, event, axiosConfig)

    expect(status).to.equal(200) &&
    expect(created.title).to.equal(event.title) &&
    expect(created.content).to.equal(event.content) &&
    expect(created.mainMedia).to.equal(event.mainMedia) &&
    expect(created.latitude).to.equal(event.latitude) &&
    expect(created.longitude).to.equal(event.longitude) &&
    expect(created.tags).to.be.an('array')
  }).timeout(10000)

  it('returns an array of all events', async () => {
    const { data: events, status } = await axios.get(`${rootURL}/api/events`, axiosConfig)

    expect(status).to.equal(200) &&
    expect(events).to.be.an('array')
  }).timeout(10000)

  describe('/published', () => {
    it('returns an array of only published events', async () => {
      const { data: events, status } = await axios.get(`${rootURL}/api/events/published`, axiosConfig)
      let allArePublished = true
      _.forEach(events, found => {
        if (!found.published) allArePublished = false
      })

      expect(status).to.equal(200) &&
      expect(events).to.be.an('array') &&
      expect(allArePublished).to.equal(true)
    }).timeout(10000)
  })

  describe('/[id]', () => {
    it('gets an event by its slug', async () => {
      const { data: found, status } = await axios.get(`${rootURL}/api/events/mocha-test-event`, axiosConfig)

      expect(status).to.equal(200) &&
        expect(found.title).to.equal(event.title) &&
        expect(found.content).to.equal(event.content) &&
        expect(found.mainMedia).to.equal(event.mainMedia) &&
        expect(found.tags).to.be.an('array')
    }).timeout(10000)

    it('returns an updated event', async () => {
      const { data: found } = await axios.get(`${rootURL}/api/events/mocha-test-event`, axiosConfig)
      const updatedEvent = { ...found, content: 'This is updated test event content.' }
      const { data: updated, status } = await axios.put(`${rootURL}/api/events/${found._id}`, updatedEvent, axiosConfig)

      expect(status).to.equal(200) &&
      expect(updated.title).to.equal(updatedEvent.title) &&
      expect(updated.content).to.equal(updatedEvent.content) &&
      expect(updated.mainMedia).to.equal(updatedEvent.mainMedia) &&
      expect(updated.tags).to.be.an('array')
    }).timeout(10000)

    it('deletes an event', async () => {
      const { data: found } = await axios.get(`${rootURL}/api/events/mocha-test-event`, axiosConfig)
      const { status } = await axios.delete(`${rootURL}/api/events/${found._id}`, axiosConfig)

      expect(status).to.equal(200)
    }).timeout(10000)
  })
})