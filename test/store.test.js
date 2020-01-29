import { expect } from 'chai'
import axios from 'axios'
import keys from '../src/config/keys'
const { rootURL, test } = keys


const axiosConfig = {
  withCredentials: true,
  headers: {
    Authorization: `bearer ${test.token}`
  }
}


const product = {
  title: 'Mocha Test Product',
  content: 'This is some test product content.',
  tags: 'test, product',
  published: true,
  mainMedia: 'some-picture.jpg',
  price: 2.99,
  quantity: 10
}


describe('/api/store', () => {
  describe('/products', () => {
    it('creates and returns a product', async () => {
      const { data: created, status } = await axios.post(`${rootURL}/api/store/products`, product, axiosConfig)

      expect(status).to.equal(200) &&
      expect(created.title).to.equal(product.title) &&
      expect(created.content).to.equal(product.content) &&
      expect(created.mainMedia).to.equal(product.mainMedia) &&
      expect(created.price).to.equal(product.price) &&
      expect(created.quantity).to.equal(product.quantity) &&
      expect(created.tags).to.be.an('array')
    })

    it('returns an array of all products', async () => {
      const { data: products, status } = await axios.get(`${rootURL}/api/store/products`, axiosConfig)

      expect(status).to.equal(200) &&
      expect(products).to.be.an('array')
    })

    describe('/published', () => {
      it('returns an array of only published products', async () => {
        const { data: products, status } = await axios.get(`${rootURL}/api/store/products/published`, axiosConfig)
        let allArePublished = true
        products.forEach(found => {
          if (!found.published) allArePublished = false
        })

        expect(status).to.equal(200) &&
        expect(products).to.be.an('array') &&
        expect(allArePublished).to.equal(true)
      })
    })

    describe('/[id]', () => {
      it('gets a product by its slug', async () => {
        const { data: found, status } = await axios.get(`${rootURL}/api/store/products/mocha-test-product`, axiosConfig)

        expect(status).to.equal(200) &&
        expect(found.title).to.equal(product.title) &&
        expect(found.content).to.equal(product.content) &&
        expect(found.mainMedia).to.equal(product.mainMedia) &&
        expect(found.price).to.equal(product.price) &&
        expect(found.quantity).to.equal(product.quantity) &&
        expect(found.tags).to.be.an('array')
      })

      it('returns an updated product', async () => {
        const { data: found } = await axios.get(`${rootURL}/api/store/products/mocha-test-product`, axiosConfig)
        const updatedProduct = { ...found, content: 'This is updated test product content.' }
        const { data: updated, status } = await axios.put(`${rootURL}/api/store/products/${found._id}`, updatedProduct, axiosConfig)

        expect(status).to.equal(200) &&
        expect(updated.title).to.equal(updatedProduct.title) &&
        expect(updated.content).to.equal(updatedProduct.content) &&
        expect(updated.mainMedia).to.equal(updatedProduct.mainMedia) &&
        expect(updated.price).to.equal(updatedProduct.price) &&
        expect(updated.quantity).to.equal(updatedProduct.quantity) &&
        expect(updated.tags).to.be.an('array')
      })

      it('deletes a product', async () => {
        const { data: found } = await axios.get(`${rootURL}/api/store/products/mocha-test-product`, axiosConfig)
        const { status } = await axios.delete(`${rootURL}/api/store/products/${found._id}`, axiosConfig)

        expect(status).to.equal(200)
      })
    })
  })

  describe('/cart', () => {
    describe('/[id]', () => {
      it('adds a product to the user\'s cart', async () => {
        const { data: created } = await axios.post(`${rootURL}/api/store/products`, product, axiosConfig)
        const { data: cart, status } = await axios.put(`${rootURL}/api/store/cart/${created._id}`, {}, axiosConfig)
        const { data: user } = await axios.get(`${rootURL}/api/auth/currentUser`, axiosConfig)

        expect(status).to.equal(200) &&
        expect(cart).to.eql(user.cart)
      })

      it('removes a product from the user\'s cart', async () => {
        const { data: found } = await axios.get(`${rootURL}/api/store/products/mocha-test-product`, axiosConfig)
        const { data: cart, status } = await axios.delete(`${rootURL}/api/store/cart/${found._id}`, axiosConfig)
        const { data: user } = await axios.get(`${rootURL}/api/auth/currentUser`, axiosConfig)

        expect(status).to.equal(200) &&
        expect(cart).to.eql(user.cart)
      })
    })
  })

  describe('/checkout', () => {
    // I don't know how to create a test card programatically currently
  })

  describe('/orders', () => {
    // Cannot create a test order without /checkout
  })
})