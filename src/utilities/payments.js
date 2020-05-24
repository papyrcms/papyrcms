import keys from '@/keys'
import Stripe from 'stripe'


class Payments {

  stripe

  constructor() {
    const config = { apiVersion: '2020-03-02' }
    this.stripe = new Stripe(keys.stripeSecretKey, config)
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
      console.error(err)
      return null
    }
  }
}

export default Payments
