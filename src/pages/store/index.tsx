import { Product } from 'types'
import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import _ from 'lodash'
import axios from 'axios'
import userContext from '@/context/userContext'
import storeContext from '@/context/storeContext'
import postsContext from '@/context/postsContext'
import usePostFilter from '@/hooks/usePostFilter'
import PageHead from '@/components/PageHead'
import SectionCards from '@/components/Sections/SectionCards'

const StorePage = () => {
  const { cart, addToCart, products, setProducts } = useContext(
    storeContext
  )
  const { currentUser } = useContext(userContext)

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

  const { posts } = useContext(postsContext)

  let headTitle = 'Store'
  const headerSettings = {
    maxPosts: 1,
    postTags: ['section-header'],
  }
  const {
    posts: [headerPost],
  } = usePostFilter(posts, headerSettings)
  if (headerPost) {
    headTitle = `${headerPost.title} | ${headTitle}`
  }

  return (
    <>
      <PageHead title={headTitle} />
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
    </>
  )
}

export default StorePage
