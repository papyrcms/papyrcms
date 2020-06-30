import jwt from 'jsonwebtoken'
import keys from '@/keys'


export default async (req, database) => {

  if (req.headers.authorization && req.headers.authorization.includes('bearer ')) {
    const token = req.headers.authorization.replace('bearer ', '')

    try {
      const tokenObject = jwt.verify(token, keys.jwtSecret)
      const { uid } = tokenObject
      if (uid) {
        const { User, findOne } = database
        return await findOne(User, { _id: uid, isBanned: false }, { include: ['cart'] })
      }
    } catch (err) {}
  }

  return null
}
