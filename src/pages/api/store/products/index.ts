import connect from "next-connect"
import common from "../../../../middleware/common/"
import isAdmin from "../../../../middleware/isAdmin"
import Product from "../../../../models/product"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


const getProducts = async () => {
  return await Product.find().sort({ created: -1 }).lean()
}


const createProduct = async body => {
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
  } = body

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
  return product
}


handler.get(async (req, res) => {
  const products = await getProducts()
  return res.status(200).send(products)
})


handler.post(async (req, res) => {
  const product = await createProduct(req.body)
  return res.status(200).send(product)
})


export default (req, res) => handler.apply(req, res)
