import keys from '../config/keys'
import Stripe from 'stripe'


class Payments {

  stripe: Stripe

  constructor() {
    const config: Stripe.StripeConfig = { apiVersion: '2019-12-03' }
    this.stripe = new Stripe(keys.stripeSecretTestKey, config)
  }


  async makePayment(info) {

    const { email, amount, source, description } = info

    if (!email || !amount || !source || !description) {
      return null
    }

    const paymentDetails = {
      source: source.id,
      amount: Math.floor(amount * 100), // In cents, needs to be an int
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
