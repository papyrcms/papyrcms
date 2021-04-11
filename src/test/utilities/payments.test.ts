import { expect } from 'chai'
import Payments from '../../utilities/payments'
import keys from '../../config/keys'
import Stripe from 'stripe'
const { adminEmail } = keys

describe('payments', () => {
  it('has the correct properties when constructed', () => {
    const payments = new Payments()
    expect(payments.stripe).to.exist
  }).timeout(10000)

  describe('makePayment()', () => {
    it('returns null if the incorrect info is passed', async () => {
      const payments = new Payments()
      // @ts-ignore
      const charge = await payments.makePayment({})
      expect(charge).to.equal(null)
    }).timeout(10000)

    it('returns a successful stripe charge', async () => {
      const payments = new Payments()
      const info = {
        email: adminEmail,
        amount: 1,
        source: { id: 'tok_discover' } as Stripe.Source,
        description: 'test payment',
      }
      const charge = await payments.makePayment(info)

      // @ts-ignore
      expect(charge.object).to.equal('charge') &&
        // @ts-ignore
        expect(charge.status).to.equal('succeeded') &&
        // @ts-ignore
        expect(charge.amount).to.equal(100)
    }).timeout(10000)
  })
})
