import { NextApiRequest, NextApiResponse } from 'next'
import connect from 'next-connect'
import common from '../../../middleware/common/'
import User from '../../../models/user'


const handler = connect()
handler.use(common)


const updateCurrentUser = async (body: any, user: User) => {
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

  // Make sure a user with the email does not already exist
  const existingUser = await User.findOne({ email })
  if (existingUser && !existingUser._id.equals(user._id)) {
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
  return await User.findOneAndUpdate({ _id: userId }, newUserData)
}


handler.get((req: NextApiRequest & Req, res: NextApiResponse) => {
  return res.status(200).send(req.user || null)
})


handler.put(async (req: NextApiRequest & Req, res: NextApiResponse) => {
  const updatedUser = await updateCurrentUser(req.body, req.user)
  return res.status(200).send(updatedUser)
})


export default (req: NextApiRequest & Req, res: NextApiResponse) => handler.apply(req, res)
