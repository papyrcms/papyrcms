import { Product } from '@/types'
import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import { userContext, storeContext } from '@/context'
import keys from '@/keys'
import { SectionStandard } from '@/components'

const StoreShow = (props: { product: Product }) => {
  const { currentUser } = useContext(userContext)
  const { cart, addToCart } = useContext(storeContext)
  const [product, setProduct] = useState(props.product)
  const { query } = useRouter()

  useEffect(() => {
    const resetProduct = async () => {
      if (currentUser?.isAdmin) {
        const { data: product } = await axios.get(
          `/api/store/products/${query.id}`
        )
        setProduct(product)
      }
    }
    resetProduct()
  }, [currentUser])

  const renderProductDetails = () => {
    return (
      <>
        <p>${product.price.toFixed(2)}</p>
        <p>{product.quantity} in stock</p>
        {renderCheckout(product)}
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
          <br />
          <Link href={`/store/checkout?id=${product.id}`}>
            <a>Buy it now</a>
          </Link>
        </>
      )
    }
  }

  return (
    <SectionStandard
      posts={[product]}
      path="store"
      apiPath="/api/store/products"
      redirectRoute="/store"
      afterContent={renderProductDetails}
    />
  )
}

StoreShow.getInitialProps = async ({
  query,
}: {
  query: { id: string }
}) => {
  try {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const { data: product } = await axios.get(
      `${rootUrl}/api/store/products/${query.id}`
    )
    return { product }
  } catch (err) {
    return {}
  }
}

export default StoreShow
