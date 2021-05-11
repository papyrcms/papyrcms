import { expect } from 'chai'
import axios from 'axios'
import keys from '../../config/keys'
import { Blog } from '@/types'
const { rootURL, test } = keys

const axiosConfig = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${test.token}`,
  },
}

const blog = {
  title: 'Mocha Test Blog',
  content: 'This is some test blog content.',
  tags: 'test, blog',
  isPublished: true,
  media: 'some-picture.jpg',
  publishDate: new Date('2014-03-01').toISOString(),
}

describe('/api/blogs', () => {
  it('creates and returns a blog', async () => {
    const { data: created, status } = await axios.post(
      `${rootURL}/api/blogs`,
      blog,
      axiosConfig
    )

    expect(status).to.equal(200) &&
      expect(created.title).to.equal(blog.title) &&
      expect(created.content).to.equal(blog.content) &&
      expect(created.media).to.equal(blog.media) &&
      expect(created.tags).to.be.an('array')
  }).timeout(10000)

  it('returns an array of all blogs', async () => {
    const { data: blogs, status } = await axios.get(
      `${rootURL}/api/blogs`,
      axiosConfig
    )

    expect(status).to.equal(200) && expect(blogs).to.be.an('array')
  }).timeout(10000)

  describe('/published', () => {
    it('returns an array of only published blogs', async () => {
      const { data: blogs, status } = await axios.get(
        `${rootURL}/api/blogs/published`,
        axiosConfig
      )
      let allArePublished = true
      blogs.forEach((found: Blog) => {
        if (!found.isPublished) allArePublished = false
      })

      expect(status).to.equal(200) &&
        expect(blogs).to.be.an('array') &&
        expect(allArePublished).to.equal(true)
    }).timeout(10000)
  })

  describe('/[id]', () => {
    it('gets a blog by its slug', async () => {
      const { data: found, status } = await axios.get(
        `${rootURL}/api/blogs/mocha-test-blog`,
        axiosConfig
      )

      expect(status).to.equal(200) &&
        expect(found.title).to.equal(blog.title) &&
        expect(found.content).to.equal(blog.content) &&
        expect(found.media).to.equal(blog.media) &&
        expect(found.tags).to.be.an('array')
    }).timeout(10000)

    it('returns an updated blog', async () => {
      const { data: found } = await axios.get(
        `${rootURL}/api/blogs/mocha-test-blog`,
        axiosConfig
      )
      const updatedBlog = {
        ...found,
        content: 'This is updated test blog content.',
      }
      const { data: updated, status } = await axios.put(
        `${rootURL}/api/blogs/${found.id}`,
        updatedBlog,
        axiosConfig
      )

      expect(status).to.equal(200) &&
        expect(updated.title).to.equal(updatedBlog.title) &&
        expect(updated.content).to.equal(updatedBlog.content) &&
        expect(updated.media).to.equal(updatedBlog.media) &&
        expect(updated.tags).to.be.an('array')
    }).timeout(10000)

    it('deletes a blog', async () => {
      const { data: found } = await axios.get(
        `${rootURL}/api/blogs/mocha-test-blog`,
        axiosConfig
      )
      const { status } = await axios.delete(
        `${rootURL}/api/blogs/${found.id}`,
        axiosConfig
      )

      expect(status).to.equal(200)
    }).timeout(10000)
  })
})
