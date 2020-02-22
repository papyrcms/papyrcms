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


const post = {
  title: 'Mocha Test Post',
  content: 'This is some test post content.',
  tags: 'test, post',
  published: true,
  mainMedia: 'some-picture.jpg'
}


describe('/api/posts', () => {
  it('creates and returns a post', async () => {
    const { data: created, status } = await axios.post(`${rootURL}/api/posts`, post, axiosConfig)

    expect(status).to.equal(200) &&
    expect(created.title).to.equal(post.title) &&
    expect(created.content).to.equal(post.content) &&
    expect(created.mainMedia).to.equal(post.mainMedia) &&
    expect(created.tags).to.be.an('array')
  })

  it('returns an array of all posts', async () => {
    const { data: posts, status } = await axios.get(`${rootURL}/api/posts`, axiosConfig)

    expect(status).to.equal(200) &&
    expect(posts).to.be.an('array')
  })

  describe('/published', () => {
    it('returns an array of only published posts', async () => {
      const { data: posts, status } = await axios.get(`${rootURL}/api/posts/published`)
      let allArePublished = true
      posts.forEach(found => {
        if (!found.published) allArePublished = false
      })

      expect(status).to.equal(200) &&
      expect(posts).to.be.an('array') &&
      expect(allArePublished).to.equal(true)
    })
  })

  describe('/[id]', () => {
    it('gets a post by its slug', async () => {
      const { data: found, status } = await axios.get(`${rootURL}/api/posts/mocha-test-post`)

      expect(status).to.equal(200) &&
      expect(found.title).to.equal(post.title) &&
      expect(found.content).to.equal(post.content) &&
      expect(found.mainMedia).to.equal(post.mainMedia) &&
      expect(found.tags).to.be.an('array')
    })

    it('returns an updated post', async () => {
      const { data: found } = await axios.get(`${rootURL}/api/posts/mocha-test-post`)
      const updatedPost = { ...found, content: 'This is updated test content.' }
      const { data: updated, status } = await axios.put(`${rootURL}/api/posts/${found._id}`, updatedPost, axiosConfig)

      expect(status).to.equal(200) &&
      expect(updated.title).to.equal(updatedPost.title) &&
      expect(updated.content).to.equal(updatedPost.content) &&
      expect(updated.mainMedia).to.equal(updatedPost.mainMedia) &&
      expect(updated.tags).to.be.an('array')
    })

    it('deletes a post', async () => {
      const { data: found } = await axios.get(`${rootURL}/api/posts/mocha-test-post`)
      const { status } = await axios.delete(`${rootURL}/api/posts/${found._id}`, axiosConfig)

      expect(status).to.equal(200)
    })
  })
})