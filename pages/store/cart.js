import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import { setCurrentUser } from '../../reduxStore'
import useCart from '../../hooks/useCart'
import { SectionStandard } from '../../components/Sections'


const Cart = props => {

  const { currentUser, setCurrentUser } = props
  const { cart, removeFromCart } = useCart(currentUser, setCurrentUser)

  const uniqueProducts = []
  for (const product of cart) {
    const unique = uniqueProducts.filter(prod => {
      if (prod._id.equals) {
        return prod._id.equals(product._id)
      }
      return prod._id === product._id
    }).length === 0
    if (unique) {
      uniqueProducts.push(product)
    }
  }

  const renderTotal = () => {
    let totalCost = 0
    cart.forEach(item => totalCost += item.price)

    return (
      <Fragment>
        <h3 className="heading-tertiary">Total Cost: ${totalCost.toFixed(2)}</h3>
        <Link href="/store/checkout">
          <button className="button button-primary">Checkout</button>
        </Link>
      </Fragment>
    )
  }

  const renderDetails = product => {
    let quantity
    let totalCost = 0

    if (product._id.equals) {
      quantity = cart.filter(item => {
        if (product._id.equals(item._id)) {
          totalCost += item.price
          return true
        }
        return false
      }).length
    } else {
      quantity = cart.filter(item => {
        if (item._id === product._id) {
          totalCost += item.price
          return true
        }
        return false
      }).length
    }

    return <span>{quantity} in cart (
      <a href="#" onClick={event => {
        event.preventDefault()
        removeFromCart(product)
      }}>
        remove one
      </a>
    ): ${totalCost.toFixed(2)}</span>
  }


  const renderCheckoutLink = () => {
    if (cart.length > 0) {
      return (
        <Link href="/store/checkout">
          <button className="button button-primary u-margin-bottom-medium">Checkout</button>
        </Link>
      )
    }
  }


  return <SectionStandard
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
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default connect(mapStateToProps, { setCurrentUser })(Cart)
