import mongoose from 'mongoose'
const { user: User, product: Product } = mongoose.models


const addToCart = async (productId, user) => {
  const product = await Product.findOne({ _id: productId })

  // If we are out of stock
  if (product.quantity <= 0) {
    throw Error('This product is sold out.')
  }
  // If we have all available products in our cart
  if (user.cart.filter(inCart => product._id.equals(inCart._id)).length >= product.quantity) {
    throw Error('You cannot buy more than what is available.')
  }

  user.cart.push(product)
  await User.findOneAndUpdate({ _id: user._id }, { cart: user.cart })

  return user.cart
}


const removeFromCart = async (productId, user) => {
  let removed = false
  const cart = user.cart.filter(product => {

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
  if (!req.user) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }

  try {
    let cart
    switch (req.method) {
      case 'PUT':
        cart = await addToCart(req.query.id, req.user)
        return res.send(cart)
      case 'DELETE':
        cart = await removeFromCart(req.query.id, req.user)
        return res.send(cart)
      default:
        return res.status(404).send({ message: 'Endpoint not found.' })
    }
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}
