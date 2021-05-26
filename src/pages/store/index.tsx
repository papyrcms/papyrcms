import { Product } from '@/types'
import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { userContext, storeContext, postsContext } from '@/context'
import { usePostFilter, useSearchBar } from '@/hooks'
import { PageHead } from '@/components'
import { SectionCards } from '@/components'
import styles from './store.module.scss'

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
  }, [currentUser])

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
    const quantityInCart = cart.filter(
      (cartProduct) => cartProduct.id === product.id
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
          <Link href={`/store/checkout?id=${product.id}`}>
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

  const { SearchBar, searchPosts } = useSearchBar(products)

  return (
    <div className={styles.store}>
      <PageHead title={headTitle} />
      <SectionCards
        afterTitle={() => <SearchBar className={styles.searchBar} />}
        posts={searchPosts}
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
    </div>
  )
}

export default StorePage
