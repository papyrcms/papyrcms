import React, { Fragment } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../../config/keys'
import useCart from '../../hooks/useCart'
import { setCurrentUser } from '../../../reduxStore'
import { SectionCards } from '../../components/Sections/'

const StorePage = props => {

  const { products, currentUser, setCurrentUser } = props
  const { cart, addToCart } = useCart(currentUser, setCurrentUser)


  const renderPriceAndQuantity = product => {
    return (
      <Fragment>
        <p>${product.price.toFixed(2)}</p>
        <p>{product.quantity > 0 ? `${product.quantity} in stock` : 'Sold out'}</p>
      </Fragment>
    )
  }


  const renderAddToCart = product => {
    const quantityInCart = cart.filter(cartProduct => cartProduct._id === product._id).length
    let message = 'Add to cart'
    if (quantityInCart) message += ` (${quantityInCart} now)`

    return (
      <a onClick={async event => {
        event.preventDefault()
        await addToCart(product)
      }} href="#">
        {message}
      </a>
    )
  }


  const renderCheckout = product => {
    if (product.quantity > 0) {
      return (
        <Fragment>
          {renderAddToCart(product)}
          <Link href={`/store/checkout?id=${product._id}`}>
            <a>Buy it now</a>
          </Link>
        </Fragment>
      )
    }
  }


  return <SectionCards
    posts={products}
    title='Store'
    clickableMedia
    perRow={4}
    readMore={true}
    path='store'
    contentLength={200}
    emptyMessage='There are no products yet.'
    afterPostMedia={renderPriceAndQuantity}
    afterPostLink={renderCheckout}
  />
}


StorePage.getInitialProps = async ({ req, reduxStore }) => {

  // Depending on if we are doing a client or server render
  let axiosConfig = {}
  let currentUser = null
  if (!!req) {
    axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie || ''
      }
    }
    currentUser = req.user
  } else {
    currentUser = reduxStore.getState().currentUser
  }

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const published = currentUser && currentUser.isAdmin ? '' : '/published'
  const products = await axios.get(`${rootUrl}/api/store/products${published}`, axiosConfig)

  return { products: products.data }
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser, products: state.products }
}


export default connect(mapStateToProps, { setCurrentUser })(StorePage)
