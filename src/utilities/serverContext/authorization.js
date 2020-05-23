import jwt from 'jsonwebtoken'
import User from '../../models/user'
import keys from '../../config/keys'

// to initialize the product model
require('../../models/product')


export default async (req) => {

  if (req.headers.authorization && req.headers.authorization.includes('bearer ')) {
    const token = req.headers.authorization.replace('bearer ', '')

    try {
      const tokenObject = jwt.verify(token, keys.jwtSecret)
      const { uid } = tokenObject
      if (uid) {
        return await User.findOne({ _id: uid, isBanned: false }).populate('cart').lean()
      }
    } catch (err) {}
  }

  return null
}
