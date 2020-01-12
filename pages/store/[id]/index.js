import React, { Fragment } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../../../config/keys'
import { PostShow } from '../../../components/Sections'


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
      apiPath="/api/store/products"
      redirectRoute="/store"
      afterContent={renderProductDetails}
    />
  )
}


StoreShow.getInitialProps = async ({ req, query }) => {

  // Depending on if we are doing a client or server render
  let axiosConfig = {}
  if (!!req) {
    axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie || ''
      }
    }
  }

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const res = await axios.get(`${rootUrl}/api/store/products/${query.id}`, axiosConfig)

  return { product: res.data }
}


const mapStateToProps = state => {
  return { product: state.product }
}


export default connect(mapStateToProps)(StoreShow)
