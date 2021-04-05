import { Product } from 'types'
import React, { useContext } from 'react'
import Link from 'next/link'
import _ from 'lodash'
import { storeContext } from '@/context'
import { SectionStrip } from '@/components'

const Cart = () => {
  const { cart, removeFromCart } = useContext(storeContext)

  const uniqueProducts = []
  for (const product of cart) {
    const unique =
      uniqueProducts.filter((prod) => {
        return prod._id == product._id
      }).length === 0
    if (unique) {
      uniqueProducts.push(product)
    }
  }

  const renderTotal = () => {
    let totalCost = 0
    _.forEach(cart, (item) => (totalCost += item.price))

    return (
      <>
        <h3 className="heading-tertiary">
          Total Cost: ${totalCost.toFixed(2)}
        </h3>
        <Link href="/store/checkout">
          <button className="button button-primary">Checkout</button>
        </Link>
      </>
    )
  }

  const renderDetails = (product: Product) => {
    let quantity
    let totalCost = 0

    quantity = _.filter(cart, (item) => {
      if (item._id === product._id) {
        totalCost += item.price
        return true
      }
      return false
    }).length

    return (
      <span>
        {quantity} in cart (
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault()
            removeFromCart(product)
          }}
        >
          remove one
        </a>
        ): ${totalCost.toFixed(2)}
      </span>
    )
  }

  const renderCheckoutLink = () => {
    if (cart.length > 0) {
      return (
        <Link href="/store/checkout">
          <button className="button button-primary u-margin-bottom-medium">
            Checkout
          </button>
        </Link>
      )
    }
  }

  return (
    <SectionStrip
      posts={uniqueProducts}
      title="Cart"
      mediaLeft
      readMore
      contentLength={200}
      path="store"
      emptyMessage="Your cart is empty."
      afterTitle={renderCheckoutLink}
      afterPostTitle={renderDetails}
      afterPosts={renderTotal}
    />
  )
}

export default Cart
