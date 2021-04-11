import { Database, User } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'

const updateCurrentUser = async (
  body: any,
  user: User,
  database: Database
) => {
  const {
    userId,
    firstName,
    lastName,
    email,
    address1,
    address2,
    city,
    state,
    zip,
    country,
    shippingFirstName,
    shippingLastName,
    shippingEmail,
    shippingAddress1,
    shippingAddress2,
    shippingCity,
    shippingState,
    shippingZip,
    shippingCountry,
  } = body

  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'address1',
    'city',
    'state',
    'zip',
    'country',
  ]

  for (const field of requiredFields) {
    if (!body[field]) {
      throw new Error('Please complete all required fields.')
    }
  }

  // Make sure the user submitting the form is the logged in on the server
  if (userId.toString() !== user.id.toString()) {
    throw new Error(
      "There's a problem with your session. Try logging out and logging back in"
    )
  }

  const { findOne, update, User } = database

  // Make sure a user with the email does not already exist
  const existingUser = await findOne(User, { email })

  // @ts-ignore I don't know what it thinks is going on here
  if (existingUser && !existingUser.id == user.id) {
    throw new Error('Someone is already using this email.')
  }

  // Update user data
  const newUserData = {
    firstName,
    lastName,
    email,
    address1,
    address2,
    city,
    state,
    zip,
    country,
    shippingFirstName,
    shippingLastName,
    shippingEmail,
    shippingAddress1,
    shippingAddress2,
    shippingCity,
    shippingState,
    shippingZip,
    shippingCountry,
  }

  // Return the updated user
  await update(User, { id: userId }, newUserData)
  return await findOne(User, { id: userId })
}

const updateUserSubscription = async (
  body: any,
  user: User,
  database: Database
) => {
  const { User, update, findOne } = database
  await update(
    User,
    { id: user.id },
    { isSubscribed: body.isSubscribed }
  )

  return await findOne(User, { id: user.id })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, done, database } = await serverContext(req, res)

  if (req.method === 'GET') {
    return await done(200, user)
  }

  if (req.method === 'PUT') {
    if (!user) {
      return done(403, {
        message: 'You must be logged in to do this',
      })
    }

    let updatedUser: User | undefined
    if (req.body.hasOwnProperty('isSubscribed')) {
      updatedUser = await updateUserSubscription(
        req.body,
        user,
        database
      )
    } else {
      updatedUser = await updateCurrentUser(req.body, user, database)
    }
    return await done(200, updatedUser)
  }

  return await done(404, { message: 'Page not found.' })
}
