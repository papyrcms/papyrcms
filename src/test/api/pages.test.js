import { expect } from 'chai'
import axios from 'axios'
import keys from '@/keys'
const { rootURL, test } = keys


const axiosConfig = {
  withCredentials: true,
  headers: {
    Authorization: `bearer ${test.token}`
  }
}


const page = {
  title: 'Test Page',
  className: 'test-page-class',
  route: 'test-page-route',
  navOrder: 100,
  css: '',
  sections: [{
    type: "Standard",
    tags: "section-tag",
    title: "Section Title",
    maxPosts: 3,
    className: "section-class"
  }]
}


describe('/api/pages', () => {
  it('creates and returns a page', async () => {
    const { data: created, status } = await axios.post(`${rootURL}/api/pages`, page, axiosConfig)

    expect(status).to.equal(200) &&
    expect(created.title).to.equal(page.title) &&
    expect(created.className).to.equal(page.className) &&
    expect(created.route).to.equal(page.route) &&
    expect(created.navOrder).to.equal(page.navOrder) &&
    expect(created.css).to.equal(page.css) &&
    expect(created.sections).to.be.an('array')
  }).timeout(10000)

  it('returns an array of pages', async () => {
    const { data: pages, status } = await axios.get(`${rootURL}/api/pages`)

    expect(status).to.equal(200) &&
    expect(pages).to.be.an('array')
  }).timeout(10000)

  describe('/[id]', () => {
    it('returns a page by its route as the id', async () => {
      const { data: found, status } = await axios.get(`${rootURL}/api/pages/${page.route}`)

      expect(status).to.equal(200) &&
      expect(found.title).to.equal(page.title) &&
      expect(found.className).to.equal(page.className) &&
      expect(found.route).to.equal(page.route) &&
      expect(found.navOrder).to.equal(page.navOrder) &&
      expect(found.css).to.equal(page.css) &&
      expect(found.sections).to.be.an('array')
    }).timeout(10000)

    it('returns the updated page', async () => {
      const { data: found } = await axios.get(`${rootURL}/api/pages/${page.route}`)
      const updatedPage = { ...page, title: 'Updated Test Page Title' }
      const { data: updated, status } = await axios.put(`${rootURL}/api/pages/${found._id}`, updatedPage, axiosConfig)

      expect(status).to.equal(200) &&
      expect(updated.title).to.equal(updatedPage.title) &&
      expect(updated.className).to.equal(updatedPage.className) &&
      expect(updated.route).to.equal(updatedPage.route) &&
      expect(updated.navOrder).to.equal(updatedPage.navOrder) &&
      expect(updated.css).to.equal(updatedPage.css) &&
      expect(updated.sections).to.be.an('array')
    }).timeout(10000)

    it('deletes a page', async () => {
      const { data: found } = await axios.get(`${rootURL}/api/pages/${page.route}`)
      const { status } = await axios.delete(`${rootURL}/api/pages/${found._id}`, axiosConfig)

      expect(status).to.equal(200)
    }).timeout(10000)
  })
})