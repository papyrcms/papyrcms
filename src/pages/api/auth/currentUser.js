import mongoose from 'mongoose'
const { user: User } = mongoose.models

const updateCurrentUser = async (body, user) => {

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
      throw Error("Please complete all required fields.")
    }
  }

  // Make sure the user submitting the form is the logged in on the server
  if (userId.toString() !== user._id.toString()) {
    throw Error("There's a problem with your session. Try logging out and logging back in")
  }

  // Make sure a user with the email does not already exist
  const existingUser = await User.findOne({ email })
  if (existingUser && !existingUser._id.equals(user._id)) {
    throw Error("Someone is already using this email.")
  }

  // Update user data
  const newUserData = {
    firstName, lastName, email, address1, address2,
    city, state, zip, country, shippingFirstName,
    shippingLastName, shippingEmail, shippingAddress1, shippingAddress2,
    shippingCity, shippingState, shippingZip, shippingCountry
  }

  // Return the updated user
  return await User.findOneAndUpdate({ _id: userId }, newUserData)
}


// Main endpoint handling
export default async (req, res) => {
  try {
    switch (req.method) {
      case 'GET':
        return res.send(req.user || null)
      case 'PUT':
        const updatedUser = await updateCurrentUser(req.body, req.user)
        return res.send(updatedUser)
      default:
        return res.status(404).send({ message: 'Endpoint not found' })
    }
  } catch (error) {
    return res.status(401).send({ message: error.message })
  }
}