import { User, Database, Product } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import serverContext from '@/serverContext'

const addToCart = async (
  productId: string,
  user: User,
  database: Database
) => {
  const { findOne, save, EntityType } = database
  const product = await findOne<Product>(EntityType.Product, {
    id: productId,
  })

  if (!product) throw new Error('Product not found')

  // If we are out of stock
  if (product.quantity <= 0) {
    throw new Error('This product is sold out.')
  }

  // If we have all available products in our cart
  if (
    _.filter(user.cart, (inCart) => product.id == inCart.id).length >=
    product.quantity
  ) {
    throw new Error('You cannot buy more than what is available.')
  }

  user.cart?.push(product)
  await save(EntityType.User, user)

  return user.cart
}

const removeFromCart = async (
  productId: string,
  user: User,
  database: Database
) => {
  let removed = false
  user.cart = _.filter(user.cart, (product) => {
    // If one has not been removed and it has the passed id, remove it
    if (product.id === productId && !removed) {
      removed = true
      return false
    }

    return true
  })

  const { save, EntityType } = database
  await save(EntityType.User, user)

  return user.cart
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, settings, done, database } = await serverContext(
    req,
    res
  )

  if (
    !user ||
    (!user.isAdmin && !settings.enableStore) ||
    typeof req.query.id !== 'string'
  ) {
    return await done(403, {
      message: 'You are not allowed to do that.',
    })
  }

  if (req.method === 'PUT') {
    const cart = await addToCart(req.query.id, user, database)
    return await done(200, cart)
  }

  if (req.method === 'DELETE') {
    const cart = await removeFromCart(req.query.id, user, database)
    return await done(200, cart)
  }

  return await done(404, { message: 'Page not found.' })
}
