import _ from 'lodash'
import serverContext from "@/serverContext"
import Product from "@/models/product"
import User from "@/models/user"


const addToCart = async (productId, user) => {
  const product = await Product.findOne({ _id: productId })

  // If we are out of stock
  if (product.quantity <= 0) {
    throw new Error('This product is sold out.')
  }

  // If we have all available products in our cart
  if (_.filter(user.cart, inCart => product._id.equals(inCart._id)).length >= product.quantity) {
    throw new Error('You cannot buy more than what is available.')
  }

  user.cart.push(product)
  await User.findOneAndUpdate({ _id: user._id }, { cart: user.cart })

  return user.cart
}


const removeFromCart = async (productId, user) => {
  let removed = false
  const cart = _.filter(user.cart, product => {

    // If one has not been removed and it has the passed id, remove it
    if (product._id.equals(productId) && !removed) {
      removed = true
      return false
    }

    return true
  })

  await User.findOneAndUpdate({ _id: user._id }, { cart })

  return cart
}


export default async (req, res) => {

  const { user, settings, done } = await serverContext(req, res)
  if (!user || (!user.isAdmin && !settings.enableStore)) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'PUT') {
    const cart = await addToCart(req.query.id, user)
    return await done(200, cart)
  }


  if (req.method === 'DELETE') {
    const cart = await removeFromCart(req.query.id, user)
    return await done(200, cart)
  }


  return await done(404, { message: 'Page not found.' })
}
