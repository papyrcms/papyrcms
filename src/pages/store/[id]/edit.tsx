import { Product } from '@/types'
import React, { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Error from 'next/error'
import axios from 'axios'
import { useUser } from '@/context'
import keys from '@/keys'
import { PostsForm, Input } from '@/components'

type Props = {
  values: any
  errors: any
  validateField: Function
  handleChange: Function
}

const ProductFields = ({
  values,
  errors,
  validateField,
  handleChange,
}: Props) => {
  return (
    <div className="u-form-row">
      <Input
        id="price"
        label="Price"
        name="price"
        value={values.price || 0.0}
        validation={errors.price}
        onBlur={validateField}
        onChange={handleChange}
        type="number"
        required
      />

      <Input
        id="quantity"
        label="Stock Quantity"
        name="quantity"
        value={values.quantity || 0}
        validation={errors.quantity}
        onBlur={validateField}
        onChange={handleChange}
        type="number"
        required
      />
    </div>
  )
}

const StoreEdit = (props: { product: Product }) => {
  const { currentUser } = useUser()

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

  if (!currentUser?.isAdmin) return <Error statusCode={403} />

  return (
    <PostsForm
      pageTitle="Edit Product"
      post={product}
      apiEndpoint={`/api/store/products/${product.id}`}
      redirectRoute="/store"
      editing
      additionalFields={[ProductFields]}
      additionalState={{
        price: product.price,
        quantity: product.quantity,
      }}
    />
  )
}

StoreEdit.getInitialProps = async ({
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
  } catch (err: any) {
    return {}
  }
}

export default StoreEdit
