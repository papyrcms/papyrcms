import { expect } from 'chai'
import Payments from '../../../src/utilities/payments'
import keys from '../../../src/config/keys'
const { adminEmail } = keys

describe('payments', () => {
  it('has the correct properties when constructed', () => {
    const payments = new Payments()
    expect(payments.stripe).to.exist
  })

  describe('makePayment()', () => {
    it('returns null if the incorrect info is passed', async () => {
      const payments = new Payments()
      const charge = await payments.makePayment({})
      expect(charge).to.equal(null)
    })

    it('returns a successful stripe charge', async () => {
      const payments = new Payments()
      const info = {
        email: adminEmail,
        amount: 1,
        source: { id: 'tok_discover' },
        description: 'test payment'
      }
      const charge = await payments.makePayment(info)

      expect(charge).to.exist &&
      expect(charge.object).to.equal('charge') &&
      expect(charge.status).to.equal('succeeded') &&
      expect(charge.amount).to.equal(100)
    }).timeout(10000)
  })
})
