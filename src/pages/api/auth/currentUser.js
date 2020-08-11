import serverContext from '@/serverContext'


const updateCurrentUser = async (body, user, database) => {
  const {
    userId, firstName, lastName, email, address1, address2,
    city, state, zip, country, shippingFirstName, shippingLastName,
    shippingEmail, shippingAddress1, shippingAddress2, shippingCity,
    shippingState, shippingZip, shippingCountry
  } = body

  const requiredFields = [
    "firstName", "lastName", "email", "address1",
    "city", "state", "zip", "country"
  ]

  for (const field of requiredFields) {
    if (!body[field]) {
      throw new Error("Please complete all required fields.")
    }
  }

  // Make sure the user submitting the form is the logged in on the server
  if (userId.toString() !== user._id.toString()) {
    throw new Error("There's a problem with your session. Try logging out and logging back in")
  }

  const { findOne, update, User } = database

  // Make sure a user with the email does not already exist
  const existingUser = await findOne(User, { email })
  if (existingUser && !existingUser._id == user._id) {
    throw new Error("Someone is already using this email.")
  }

  // Update user data
  const newUserData = {
    firstName, lastName, email, address1, address2,
    city, state, zip, country, shippingFirstName,
    shippingLastName, shippingEmail, shippingAddress1, shippingAddress2,
    shippingCity, shippingState, shippingZip, shippingCountry
  }

  // Return the updated user
  await update(User, { _id: userId }, newUserData)
  return await findOne(User, { _id: userId })
}


export default async (req, res) => {

  const { user, done, database } = await serverContext(req, res)

  if (req.method === 'GET') {
    return await done(200, user)
  }
  
  if (req.method === 'PUT') {
    const updatedUser = await updateCurrentUser(req.body, user, database)
    return await done(200, updatedUser)
  }

  return await done(404, { message: 'Page not found.' })
}
