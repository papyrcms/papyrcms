import keys from '../config/keys'
import stripe from 'stripe'


class Payments {

  constructor() {
    this.stripe = stripe(keys.stripeSecretTestKey)
  }


  async makePayment(info) {

    const { email, amount, source, description } = info

    const paymentDetails = {
      source: source.id,
      amount: amount * 100,
      receipt_email: email,
      currency: 'usd',
      description
    }

    try {
      const charge = await this.stripe.charges.create(paymentDetails)
      return charge
    } catch (err) {
      console.log(err)
      return null
    }
  }
}

export default Payments