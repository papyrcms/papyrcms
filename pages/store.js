import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../config/keys'
import SectionCards from '../components/SectionCards'

class StorePage extends Component {

  static async getInitialProps() {

    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const products = await axios.get(`${rootUrl}/api/products`)

    return { posts: products.data }
  }


  render() {

    return (
      <div>
        <SectionCards
          posts={this.props.products}
          title='Store'
          perRow={4}
          readMore={true}
          path='store'
          contentLength={200}
          emptyMessage='There are no products yet.'
          infoProps={[
            { before: '$', property: 'price' },
            { property: 'stock', after: ' in stock'}
          ]}
        />
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { products: state.posts, settings: state.settings }
}


export default connect(mapStateToProps)(StorePage)
