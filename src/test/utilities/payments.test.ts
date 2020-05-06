import { expect } from 'chai'
import Payments from '../../../src/utilities/payments'

describe('payments', () => {
  it('has the correct properties when constructed', () => {
    const payments = new Payments()
    expect(payments.stripe).to.exist
  })

  describe('makePayment()', () => {
    it('returns null if the incorrect info is passed', async () => {
      const payments = new Payments()
      // @ts-ignore that's part of the test
      const charge = await payments.makePayment({})
      expect(charge).to.equal(null)
    })

    it('returns a successful stripe charge', async () => {
      const payments = new Payments()
      const info = {
        email: 'drkgrntt@gmail.com',
        amount: 1,
        source: { id: 'tok_discover' },
        description: 'test payment'
      }
      // @ts-ignore all we need is the id in source
      const charge = await payments.makePayment(info)
      expect(charge).to.exist &&
      expect(charge.object).to.equal('charge') &&
      expect(charge.status).to.equal('succeeded') &&
      expect(charge.amount).to.equal(100)
    }).timeout(10000)
  })
})
