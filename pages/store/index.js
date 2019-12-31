import React, { Fragment } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../../config/keys'
import useCart from '../../hooks/useCart'
import { setCurrentUser } from '../../reduxStore'
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


StorePage.getInitialProps = async () => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const products = await axios.get(`${rootUrl}/api/products`)

  return { products: products.data }
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser, products: state.products }
}


export default connect(mapStateToProps, { setCurrentUser })(StorePage)
