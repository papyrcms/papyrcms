import React, { Fragment } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../../config/keys'
import { PostShow } from '../../components/Sections'


const StoreShow = props => {

  const renderProductDetails = () => {
    return (
      <Fragment>
        <p>${props.product.price.toFixed(2)}</p>
        <p>{props.product.quantity} in stock</p>
      </Fragment>
    )
  }

  return (
    <PostShow
      post={props.product}
      path="store"
      apiPath="/api/products"
      redirectRoute="/store"
      afterContent={renderProductDetails}
    />
  )
}


StoreShow.getInitialProps = async context => {

  let { id, product } = context.query

  if (!product) {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const res = await axios.get(`${rootUrl}/api/products/${id}`)
    product = res.data
  }

  return { product }
}


const mapStateToProps = state => {
  return { product: state.product }
}


export default connect(mapStateToProps)(StoreShow)
