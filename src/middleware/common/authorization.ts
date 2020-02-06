import jwt from 'jsonwebtoken'
import User from '../../models/user'
import keys from '../../config/keys'

// to initialize the product model
require('../../models/product')


export default async (req, res, next) => {

  if (req.headers.authorization && req.headers.authorization.includes('bearer ')) {
    const token = req.headers.authorization.replace('bearer ', '')
    const { uid } = jwt.verify(token, keys.jwtSecret)
    if (uid) {
      req.user = await User.findOne({ _id: uid }).populate('cart').lean()
    }
  }

  return next()
}
