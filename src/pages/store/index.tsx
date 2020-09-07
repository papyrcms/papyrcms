import { Product } from 'types'
import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import _ from 'lodash'
import axios from 'axios'
import storeContext from '@/context/storeContext'
import userContext from '@/context/userContext'
import productsContext from '@/context/productsContext'
import SectionCards from '@/components/Sections/SectionCards'

const StorePage = () => {
  const { cart, addToCart } = useContext(storeContext)
  const { currentUser } = useContext(userContext)
  const { products, setProducts } = useContext(productsContext)

  useEffect(() => {
    if (currentUser?.isAdmin) {
      const getProducts = async () => {
        const { data: products } = await axios.get(
          '/api/store/products'
        )
        setProducts(products)
      }
      getProducts()
    } else if (products.length === 0) {
      const fetchProducts = async () => {
        const { data: foundProducts } = await axios.get(
          '/api/store/products/published'
        )
        setProducts(foundProducts)
      }
      fetchProducts()
    }
  }, [products, currentUser])

  const renderPriceAndQuantity = (product: Product) => {
    return (
      <>
        <p>${product.price.toFixed(2)}</p>
        <p>
          {product.quantity > 0
            ? `${product.quantity} in stock`
            : 'Sold out'}
        </p>
      </>
    )
  }

  const renderAddToCart = (product: Product) => {
    const quantityInCart = _.filter(
      cart,
      (cartProduct) => cartProduct._id === product._id
    ).length
    let message = 'Add to cart'
    if (quantityInCart) message += ` (${quantityInCart} now)`

    return (
      <a
        onClick={async (event) => {
          event.preventDefault()
          await addToCart(product)
        }}
        href="#"
      >
        {message}
      </a>
    )
  }

  const renderCheckout = (product: Product) => {
    if (product.quantity > 0) {
      return (
        <>
          {renderAddToCart(product)}
          <Link href={`/store/checkout?id=${product._id}`}>
            <a>Buy it now</a>
          </Link>
        </>
      )
    }
  }

  return (
    <SectionCards
      posts={products}
      title="Store"
      clickableMedia
      perRow={4}
      readMore={true}
      path="store"
      contentLength={200}
      emptyMessage="There are no products yet."
      afterPostMedia={renderPriceAndQuantity}
      afterPostLink={renderCheckout}
    />
  )
}

export default StorePage
