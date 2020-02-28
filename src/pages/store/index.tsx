import React, { Fragment, useState, useContext, useEffect } from 'react'
import Link from 'next/link'
import _ from 'lodash'
import axios from 'axios'
import storeContext from '../../context/storeContext'
import userContext from '../../context/userContext'
import keys from '../../config/keys'
import { SectionCards } from '../../components/Sections/'


const StorePage = props => {

  const { cart, addToCart } = useContext(storeContext)
  const { currentUser } = useContext(userContext)

  const [products, setProducts] = useState(props.products)
  useEffect(() => {
    const resetProducts = async () => {
      if (currentUser && currentUser.isAdmin) {
        const { data: allProducts } = await axios.get('/api/store/products')
        setProducts(allProducts)
      }
    }
    resetProducts()
  }, [currentUser])


  const renderPriceAndQuantity = product => {
    return (
      <Fragment>
        <p>${product.price.toFixed(2)}</p>
        <p>{product.quantity > 0 ? `${product.quantity} in stock` : 'Sold out'}</p>
      </Fragment>
    )
  }


  const renderAddToCart = product => {
    const quantityInCart = _.filter(cart, cartProduct => cartProduct._id === product._id).length
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
  const { data: products } = await axios.get(`${rootUrl}/api/store/products/published`)

  return { products }
}


export default StorePage
