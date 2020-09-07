import { expect } from 'chai'
import axios from 'axios'
import _ from 'lodash'
import keys from '../../config/keys'
const { rootURL, test, adminEmail } = keys


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
    }).timeout(10000)

    it('returns an array of all products', async () => {
      const { data: products, status } = await axios.get(`${rootURL}/api/store/products`, axiosConfig)

      expect(status).to.equal(200) &&
      expect(products).to.be.an('array')
    }).timeout(10000)

    describe('/published', () => {
      it('returns an array of only published products', async () => {
        const { data: products, status } = await axios.get(`${rootURL}/api/store/products/published`, axiosConfig)
        let allArePublished = true
        _.forEach(products, found => {
          if (!found.published) allArePublished = false
        })

        expect(status).to.equal(200) &&
        expect(products).to.be.an('array') &&
        expect(allArePublished).to.equal(true)
      }).timeout(10000)
    })

    describe('/[id]', () => {
      it('gets a product by its slug', async () => {
        const { data: found, status } = await axios.get(`${rootURL}/api/store/products/mocha-test-product`, axiosConfig)

        expect(status).to.equal(200) &&
        expect(found.title).to.equal(product.title) &&
        expect(found.content).to.equal(product.content) &&
        expect(found.mainMedia).to.equal(product.mainMedia) &&
        expect(found.price).to.equal(product.price) &&
        expect(found.tags).to.be.an('array')
      }).timeout(10000)

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
      }).timeout(10000)

      it('deletes a product', async () => {
        const { data: found } = await axios.get(`${rootURL}/api/store/products/mocha-test-product`, axiosConfig)
        const { status } = await axios.delete(`${rootURL}/api/store/products/${found._id}`, axiosConfig)

        expect(status).to.equal(200)
      }).timeout(10000)
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
      }).timeout(10000)

      it('removes a product from the user\'s cart', async () => {
        const { data: found } = await axios.get(`${rootURL}/api/store/products/mocha-test-product`, axiosConfig)
        const { data: cart, status } = await axios.delete(`${rootURL}/api/store/cart/${found._id}`, axiosConfig)
        const { data: user } = await axios.get(`${rootURL}/api/auth/currentUser`, axiosConfig)
        await axios.delete(`${rootURL}/api/store/products/${found._id}`, axiosConfig)

        expect(status).to.equal(200) &&
        expect(cart).to.eql(user.cart)
      }).timeout(10000)
    })
  })

  describe('/checkout', () => {
    
    it('buys all items from the cart and returns a string', async () => {
      // Add an item to the cart to be able to checkout
      const { data: created } = await axios.post(`${rootURL}/api/store/products`, product, axiosConfig)
      const { data: cart } = await axios.put(`${rootURL}/api/store/cart/${created._id}`, {}, axiosConfig)

      const fields = {
        firstName: 'Test',
        lastName: 'User',
        email: adminEmail,
        address1: '1234 main st.',
        city: 'Kansas City',
        state: 'MO',
        zip: 64050,
        country: 'US',
        products: cart,
        source: {
          id: 'tok_discover'
        }
      }

      const { data: response, status } = await axios.post(`${rootURL}/api/store/checkout`, fields)

      expect(status).to.equal(200) &&
      expect(response).to.be.a('string')

    }).timeout(10000)
  })

  describe('/orders', () => {
    
    it('returns an array of orders', async () => {
      const { data: orders } = await axios.get(`${rootURL}/api/store/orders`, axiosConfig)

      expect(orders).to.be.an('array')
    }).timeout(10000)

    describe('/[id]', () => {
      it('updates the order as shipped', async () => {
        const { data: orders } = await axios.get(`${rootURL}/api/store/orders`, axiosConfig)
        const [order] = orders

        const { data: updatedOrder, status } = await axios.put(`${rootURL}/api/store/orders/${order._id}`, { shipped: true }, axiosConfig)

        expect(status).to.equal(200) &&
        expect(updatedOrder.shipped).to.equal(true)
      }).timeout(10000)

      it('deletes the order', async () => {
        const { data: orders } = await axios.get(`${rootURL}/api/store/orders`, axiosConfig)
        const [order] = orders

        const { data: response, status } = await axios.delete(`${rootURL}/api/store/orders/${order._id}`, axiosConfig)

        expect(status).to.equal(200) &&
        expect(response).to.be.a('string')
      }).timeout(10000)
    })
  })
})