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
        <p>{product.quantity} in stock</p>
      </Fragment>
    )
  }

  const renderCheckout = product => {
    return (
      <Link href={`/store/checkout?id=${product._id}`}>
        <a>Buy it now</a>
      </Link>
    )
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
  return { products: state.products }
}


export default connect(mapStateToProps)(StorePage)
