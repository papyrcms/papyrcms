import Controller from './abstractController'
import Product from '../models/product'
import Order from '../models/order'
import User from '../models/user'
import Payments from '../utilities/payments'
import Mailer from '../utilities/mailer'
import keys from '../config/keys'
import { checkIfAdmin, checkIfLoggedIn, sanitizeRequestBody } from '../utilities/middleware'
import { configureSettings } from '../utilities/functions'


class StoreController extends Controller {

  constructor(server, app) {
    super(server, app)

    server.use(async (req, res, next) => {
      if (!req.user) {
        return next()
      }

      let i = 0
      for (const productId of req.user.cart) {
        req.user.cart[i] = await Product.findOne({ _id: productId })
        i++
      }
      next()
    })
  }

  registerSettings() {

    // Middleware to configure store settings
    this.server.use(async (req, res, next) => {

      const defaultSettings = { enableStore: false }
      const settings = await configureSettings('store', defaultSettings)

      Object.keys(settings).forEach(optionKey => {
        const optionValue = settings[optionKey]

        res.locals.settings[optionKey] = optionValue
      })
      next()
    })
  }


  registerRoutes() {

    // Views
    this.server.get(
      '/store/:id',
      this.checkIfStoreEnabled,
      this.renderPage.bind(this, 'show')
    )
    this.server.get(
      '/store/:id/edit',
      this.checkIfStoreEnabled,
      checkIfAdmin,
      this.renderPage.bind(this, 'edit')
    )

    // Products API
    this.server.post(
      '/api/products',
      checkIfAdmin,
      sanitizeRequestBody,
      this.createProduct.bind(this)
    )
    this.server.get(
      '/api/products',
      this.sendAllProducts.bind(this)
    )
    this.server.get(
      '/api/publishedProducts',
      this.sendPublishedProducts.bind(this)
    )
    this.server.get(
      '/api/products/:id',
      this.sendOneProduct.bind(this)
    )
    this.server.put(
      '/api/products/:id',
      checkIfAdmin,
      sanitizeRequestBody,
      this.updateProduct.bind(this)
    )
    this.server.delete(
      '/api/products/:id',
      checkIfAdmin,
      this.deleteProduct.bind(this)
    )

    // Order API
    this.server.post(
      '/api/checkout',
      this.checkout.bind(this)
    )
    this.server.get(
      '/api/orders',
      checkIfAdmin,
      this.sendOrders.bind(this)
    )
    this.server.put(
      '/api/orders/:id',
      checkIfAdmin,
      this.updateOrder.bind(this)
    )
    this.server.delete(
      '/api/orders/:id',
      checkIfAdmin,
      this.deleteOrder.bind(this)
    )

    // Cart API
    this.server.put(
      '/api/cart/:id',
      checkIfLoggedIn,
      this.addToCart.bind(this)
    )
    this.server.delete(
      '/api/cart/:id',
      checkIfLoggedIn,
      this.removeFromCart.bind(this)
    )
  }


  checkIfStoreEnabled(req, res, next) {

    const { settings } = res.locals

    if (settings && settings.enableStore) {
      next()
    } else {
      res.status(401).send({ message: 'You are not allowed to do that' })
    }
  }


  async renderPage(pageExtension, req, res, next) {

    let product
    try {
      product = await Product.findById(req.params.id)
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    } catch (e) {
      product = await Product.findOne({ slug: req.params.id })
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    }

    if (product) {
      const actualPage = `/store/${pageExtension}`
      const queryParams = { id: req.params.id, product }

      this.app.render(req, res, actualPage, queryParams)

    } else {

      next()
    }

  }


  createProduct(req, res) {

    const {
      title,
      content,
      tags,
      mainMedia,
      subImages,
      published,
      created,
      price,
      quantity
    } = req.body

    const product = new Product({
      title,
      content,
      tags,
      mainMedia,
      subImages,
      published,
      created,
      price,
      quantity
    })
    product.slug = title.replace(/\s+/g, '-').toLowerCase()

    product.save()
    res.send(product)
  }


  async sendAllProducts(req, res) {

    const foundProducts = await Product.find().sort({ created: -1 }).lean()
    res.send(foundProducts)
  }


  async sendPublishedProducts(req, res) {

    const foundProducts = await Product.find({ published: true }).sort({ created: -1 }).lean()
    res.send(foundProducts)
  }


  async sendOneProduct(req, res) {

    let foundProduct
    try {
      foundProduct = await Product.findById(req.params.id)
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    } catch(e) {
      foundProduct = await Product.findOne({ slug: req.params.id })
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    }

    res.send(foundProduct)
  }


  async updateProduct(req, res) {

    const productDocument = { _id: req.params.id }
    req.body.slug = req.body.title.replace(/\s+/g, '-').toLowerCase()
    const updatedProduct = await Product.findOneAndUpdate(productDocument, req.body)

    res.send(updatedProduct)
  }


  async deleteProduct(req, res) {

    await Product.findByIdAndDelete(req.params.id)

    res.send('product deleted')
  }


  async checkout(req, res) {

    const {
      products, source, notes, firstName, lastName,
      email, address1, address2, city, state, zip, country,
      shippingEmail, shippingFirstName, shippingLastName,
      shippingAddress1, shippingAddress2, shippingCity,
      shippingState, shippingZip, shippingCountry, fromCart
    } = req.body

    const requiredFields = [
      'firstName', 'lastName', 'email', 'address1',
      'city', 'state', 'zip', 'country'
    ]

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(401).send({ message: 'Please complete all required fields' })
      }
    }

    if (!products || !source) {
      return res.status(401).send({ message: 'Something went wrong. Please try again later or contact us.' })
    }

    // Set dynamic amount and description
    let amount = 0
    let description = 'Payment for '
    for (const product of products) {

      // If there is no stock left, error
      if (product.quantity < 1) {
        return res.status(401).send({ message: `${product.title} is out of stock.` })
      }

      amount += product.price
      description = description + product.title + ', '
    }
    description = description.substring(0, description.length-2) + '.'

    // Stripe charge info
    const info = {
      email,
      amount,
      description,
      source,
    }

    const payments = new Payments()
    const charge = await payments.makePayment(info)

    // If a charge was successfully created
    if (charge) {

      // Create an order
      const order = new Order({ notes })

      if (req.user) {
        order.user = req.user
      }

      if (order.notes) {
        order.notes += '\n\n'
      }

      order.notes += `User info is:
${shippingFirstName || firstName} ${shippingLastName || lastName}
${shippingEmail || email}
${shippingAddress1 || address1}${(shippingAddress2 || address2) ? `\n${shippingAddress2 || address2}` : ''}
${shippingCity || city}, ${shippingState || state} ${shippingZip || zip}
${shippingCountry || country}
`

      // Start the email message
      let message = 'A new order has been placed for the following items:\n\n'

      // Save the updated products and put in the order
      for (const product of products) {
        const found = await Product.findById(product._id)
        found.quantity--
        found.save()
        order.products.push(found)

        message += `- ${product.title}\n`
      }

      // Add order notes to the email
      message += `\nNotes:\n${order.notes}`

      message += '\nMake sure you send it as soon as possible!'

      // Save and send the order
      order.save()
      const mailer = new Mailer()
      mailer.sendEmail({ message }, keys.adminEmail, 'plain', 'New Order!')

      if (req.user && fromCart) {
        await User.findOneAndUpdate({ _id: req.user._id }, { cart: [] })
      }

      res.send('All items purchased')
    } else {
      res.status(401).send({ message: 'Something went wrong. Please contact us directly to order.' })
    }
  }


  async sendOrders(req, res) {

    const orders = await Order.find().sort({ created: -1 })
      .populate('user').populate('products').lean()

    res.send(orders)
  }


  async updateOrder(req, res) {
    await Order.findOneAndUpdate({ _id: req.params.id }, { shipped: req.body.shipped })
    res.send('updated')
  }


  async deleteOrder(req, res) {
    await Order.findByIdAndDelete(req.params.id)
    res.send('deleted')
  }


  async addToCart(req, res) {

    const product = await Product.findOne({ _id: req.params.id })
    // If we are out of stock
    if (product.quantity <= 0) {
      return res.status(401).send({ message: 'This product is sold out.' })
    }
    // If we have all available products in our cart
    if (req.user.cart.filter(inCart => product._id.equals(inCart._id)).length >= product.quantity) {
      return res.status(401).send({ message: 'You cannot buy more than what is available.' })
    }

    req.user.cart.push(product)
    await User.findOneAndUpdate({ _id: req.user._id }, { cart: req.user.cart })

    res.send(req.user.cart)
  }


  async removeFromCart(req, res) {

    // This function remove ONE item from the cart, not all of a particular product
    let removed = false
    const cart = req.user.cart.filter(product => {

      // If one has not been removed and it has the passed id, remove it
      if (product._id.equals(req.params.id) && !removed) {
        removed = true
        return false
      }

      return true
    })

    await User.findOneAndUpdate({ _id: req.user._id }, { cart })

    res.send(cart)
  }
}

export default StoreController
