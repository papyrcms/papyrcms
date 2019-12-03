import React, { Fragment, Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../../config/keys'
import { PostShow } from '../../components/Sections'

const renderAddToCardSection = () => {

  return <h1>Oh Snap.</h1>
}



const StoreShow = props => {

  const { product } = props

  return (
    <Fragment>
      <PostShow
        post={product}
        path="store"
        apiPath="/api/products"
        redirectRoute="/store"
      />
      {renderAddToCardSection()}
    </Fragment>
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
