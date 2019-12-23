import React, { Fragment } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../../config/keys'
import { SectionCards } from '../../components/Sections/'

const StorePage = props => {

  const renderPriceAndQuantity = product => {
    return (
      <Fragment>
        <p>${product.price.toFixed(2)}</p>
        <p>{
          product.quantity > 0
            ? `${product.quantity} in stock`
            : 'Sold out'
        }</p>
      </Fragment>
    )
  }

  const addToCart = product => {
    
  }

  const renderCheckout = product => {
    if (product.quantity > 0) {
      return (
        <Fragment>
          <a onClick={() => addToCart(product)} href="#">Add to cart</a>
          <Link href={`/store/checkout?id=${product._id}`}>
            <a>Buy it now</a>
          </Link>
        </Fragment>
      )
    }
  }

  return <SectionCards
    posts={props.products}
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


export default connect(mapStateToProps)(StorePage)
