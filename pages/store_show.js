import React, { Fragment, Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../config/keys'
import PostShow from '../components/PostShow'

class StoreShow extends Component {

  static async getInitialProps(context) {

    const { id } = context.query
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const product = await axios.get(`${rootUrl}/api/products/${id}`)

    return { product: product.data }
  }


  renderAddToCardSection() {

    return <h1>Oh Snap.</h1>
  }


  render() {

    const { product } = this.props

    return (
      <Fragment>
        <PostShow
          post={product}
          path="store"
          apiPath="/api/products"
          redirectRoute="/store"
        />
        {this.renderAddToCardSection()}
      </Fragment>
    )
  }
}


const mapStateToProps = state => {
  return { product: state.product }
}


export default connect(mapStateToProps)(StoreShow)
