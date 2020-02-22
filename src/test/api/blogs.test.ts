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


const blog = {
  title: 'Mocha Test Blog',
  content: 'This is some test blog content.',
  tags: 'test, blog',
  published: true,
  mainMedia: 'some-picture.jpg',
  publishDate: new Date('2014-03-01').toISOString()
}


describe('/api/blogs', () => {
  it('creates and returns a blog', async () => {
    const { data: created, status } = await axios.post(`${rootURL}/api/blogs`, blog, axiosConfig)

    expect(status).to.equal(200) &&
    expect(created.title).to.equal(blog.title) &&
    expect(created.content).to.equal(blog.content) &&
    expect(created.mainMedia).to.equal(blog.mainMedia) &&
    expect(created.tags).to.be.an('array')
  })

  it('returns an array of all blogs', async () => {
    const { data: blogs, status } = await axios.get(`${rootURL}/api/blogs`, axiosConfig)

    expect(status).to.equal(200) &&
    expect(blogs).to.be.an('array')
  })

  describe('/published', () => {
    it('returns an array of only published blogs', async () => {
      const { data: blogs, status } = await axios.get(`${rootURL}/api/blogs/published`, axiosConfig)
      let allArePublished = true
      blogs.forEach(found => {
        if (!found.published) allArePublished = false
      })

      expect(status).to.equal(200) &&
      expect(blogs).to.be.an('array') &&
      expect(allArePublished).to.equal(true)
    })
  })

  describe('/[id]', () => {
    it('gets a blog by its slug', async () => {
      const { data: found, status } = await axios.get(`${rootURL}/api/blogs/mocha-test-blog`, axiosConfig)

      expect(status).to.equal(200) &&
      expect(found.title).to.equal(blog.title) &&
      expect(found.content).to.equal(blog.content) &&
      expect(found.mainMedia).to.equal(blog.mainMedia) &&
      expect(found.tags).to.be.an('array')
    })

    it('returns an updated blog', async () => {
      const { data: found } = await axios.get(`${rootURL}/api/blogs/mocha-test-blog`, axiosConfig)
      const updatedBlog = { ...found, content: 'This is updated test blog content.' }
      const { data: updated, status } = await axios.put(`${rootURL}/api/blogs/${found._id}`, updatedBlog, axiosConfig)

      expect(status).to.equal(200) &&
      expect(updated.title).to.equal(updatedBlog.title) &&
      expect(updated.content).to.equal(updatedBlog.content) &&
      expect(updated.mainMedia).to.equal(updatedBlog.mainMedia) &&
      expect(updated.tags).to.be.an('array')
    })

    it('deletes a blog', async () => {
      const { data: found } = await axios.get(`${rootURL}/api/blogs/mocha-test-blog`, axiosConfig)
      const { status } = await axios.delete(`${rootURL}/api/blogs/${found._id}`, axiosConfig)

      expect(status).to.equal(200)
    })
  })
})