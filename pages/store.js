import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../config/keys'
import { SectionCards } from '../components/Sections/'

const StorePage = props => (
  <div>
    <SectionCards
      posts={props.products}
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


StorePage.getInitialProps = () => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const products = await axios.get(`${rootUrl}/api/products`)

  return { posts: products.data }
}


const mapStateToProps = state => {
  return { products: state.posts }
}


export default connect(mapStateToProps)(StorePage)
