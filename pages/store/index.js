import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../../config/keys'
import { SectionCards } from '../../components/Sections/'

const StorePage = props => (
  <div className="store-page">
    <SectionCards
      posts={props.products}
      title='Store'
      clickableMedia
      perRow={4}
      readMore={true}
      path='store'
      contentLength={200}
      emptyMessage='There are no products yet.'
    />
  </div>
)


StorePage.getInitialProps = async () => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const products = await axios.get(`${rootUrl}/api/products`)

  return { products: products.data }
}


const mapStateToProps = state => {
  return { products: state.products }
}


export default connect(mapStateToProps)(StorePage)
