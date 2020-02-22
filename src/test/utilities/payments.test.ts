import { expect } from 'chai'
import Payments from '../../src/utilities/payments'

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

    // I don't know how to test success cases with stripe yet
  })
})
