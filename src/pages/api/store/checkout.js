import serverContext from '../../../utilities/serverContext/'
import Mailer from '../../../utilities/mailer'
import Payments from '../../../utilities/payments'
import keys from '../../../config/keys'
import Order from "../../../models/order"
import Product from "../../../models/product"
import User from "../../../models/user"


export default async (req, res) => {

  const { user } = await serverContext(req, res)

  if (req.method === 'POST') {

    const {
      products, source, notes, firstName, lastName,
      email, address1, address2, city, state, zip, country,
      shippingEmail, shippingFirstName, shippingLastName,
      shippingAddress1, shippingAddress2, shippingCity,
      shippingState, shippingZip, shippingCountry, fromCart
    } = req.body

    const requiredFields = [
      'firstName', 'lastName', 'email', 'address1',
      'city', 'state', 'zip', 'country'
    ]

    // Make sure all required fields are present
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).send({ message: 'Please complete all required fields' })
      }
    }

    if (!products || !source) {
      return res.status(400).send({ message: 'Something went wrong. Please try again later or contact us.' })
    }

    // Set dynamic amount and description
    let amount = 0
    let description = 'Payment for '
    for (const product of products) {

      // If there is no stock left, error
      if (product.quantity < 1) {
        return res.status(401).send({ message: `${product.title} is out of stock.` })
      }

      amount += product.price
      description = description + product.title + ', '
    }
    description = description.substring(0, description.length - 2) + '.'

    // Stripe charge info
    const info = {
      email,
      amount,
      description,
      source,
    }

    const payments = new Payments()
    const charge = await payments.makePayment(info)

    // If a charge was successfully created
    if (charge) {

      // Create an order
      const order = new Order({ notes })

      if (user) {
        order.user = user
      }

      if (order.notes) {
        order.notes += '\n\n'
      }

      order.notes += `User info is:
  ${shippingFirstName || firstName} ${shippingLastName || lastName}
  ${shippingEmail || email}
  ${shippingAddress1 || address1}${(shippingAddress2 || address2) ? `\n${shippingAddress2 || address2}` : ''}
  ${shippingCity || city}, ${shippingState || state} ${shippingZip || zip}
  ${shippingCountry || country}
  `

      // Start the email message
      let message = 'A new order has been placed for the following items:\n\n'

      // Save the updated products and put in the order
      for (const product of products) {
        const found = await Product.findById(product._id)
        found.quantity--
        found.save()
        order.products.push(found)

        message += `- ${product.title}\n`
      }

      // Add order notes to the email
      message += `\nNotes:\n${order.notes}`
      message += '\nMake sure you send it as soon as possible!'

      // Save and send the order
      order.save()
      const mailer = new Mailer()
      mailer.sendEmail({ message }, keys.adminEmail, 'plain', 'New Order!')

      if (user && fromCart) {
        await User.findOneAndUpdate({ _id: user._id }, { cart: [] })
      }

      return res.status(200).send('All items purchased')
    } else {
      return res.status(401).send({ message: 'Something went wrong. Please contact us directly to order.' })
    }
  }

  return res.status(404).send({ message: 'Page not found.' })
}