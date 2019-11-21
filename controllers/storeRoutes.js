const Controller = require('./abstractController')
const ProductModel = require('../models/product')
const { checkIfAdmin, sanitizeRequestBody } = require('../utilities/middleware')
const { configureSettings } = require('../utilities/functions')


class StoreRoutes extends Controller {

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
      '/store',
      this.checkIfStoreEnabled,
      this.renderPage.bind(this, '')
    )
    this.server.get(
      '/store/new',
      this.checkIfStoreEnabled,
      checkIfAdmin,
      this.renderPage.bind(this, '_create')
    )
    this.server.get(
      '/store/checkout',
      this.checkIfStoreEnabled,
      this.renderPage.bind(this, '_checkout')
    )
    this.server.get(
      '/store/:id',
      this.checkIfStoreEnabled,
      this.renderPage.bind(this, '_show')
    )
    this.server.get(
      '/store/:id/edit',
      this.checkIfStoreEnabled,
      checkIfAdmin,
      this.renderPage.bind(this, '_edit')
    )

    // Store API
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
      '/api/published_products',
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
  }


  checkIfStoreEnabled(req, res, next) {

    const { settings } = res.locals

    if (settings && settings.enableStore) {
      next()
    } else {
      res.status(401).send({ message: 'You are not allowed to do that' })
    }
  }


  renderPage(pageExtension, req, res) {

    const actualPage = `/store${pageExtension}`
    const id = !!req.params ? req.params.id : null
    const queryParams = { id }

    this.app.render(req, res, actualPage, queryParams)
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

    const product = new ProductModel({
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

    const foundProducts = await ProductModel.find().sort({ created: -1 }).lean()

    res.send(foundProducts)
  }


  async sendPublishedProducts(req, res) {

    const foundProducts = await ProductModel.find({ published: true }).sort({ created: -1 }).lean()

    res.send(foundProducts)
  }


  async sendOneProduct(req, res) {

    let foundProduct
    try {
      foundProduct = await ProductModel.findById(req.params.id)
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    } catch(e) {
      foundProduct = await ProductModel.findOne({ slug: req.params.id })
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
    const updatedProduct = await ProductModel.findOneAndUpdate(productDocument, req.body)

    res.send(updatedProduct)
  }


  async deleteProduct(req, res) {

    const product = await ProductModel.findById(req.params.id)

    await ProductModel.findByIdAndDelete(req.params.id)

    res.send('product deleted')
  }
}

module.exports = StoreRoutes
