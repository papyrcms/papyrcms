import React, { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import userContext from '../../../context/userContext'
import keys from '../../../config/keys'
import PostsForm from '../../../components/PostsForm'
import Input from '../../../components/Input'


const ProductFields = ({ values, errors, validateField, handleChange }) => {

  return(
    <div className="u-form-row">
      <Input
        id="price"
        label="Price"
        name="price"
        value={values.price || 0.00}
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

const StoreEdit = props => {

  const { currentUser } = useContext(userContext)

  const [product, setProduct] = useState(props.product)
  const { query } = useRouter()

  useEffect(() => {
    const resetProduct = async () => {
      if (currentUser && currentUser.isAdmin) {
        const { data: product } = await axios.get(`/api/store/products/${query.id}`)
        setProduct(product)
      }
    }
    resetProduct()
  }, [currentUser])

  return (
    <PostsForm
      pageTitle="Edit Product"
      post={product}
      apiEndpoint={`/api/store/products/${product._id}`}
      redirectRoute="/store"
      editing
      additionalFields={[ProductFields]}
      additionalState={{
        price: product.price,
        quantity: product.quantity
      }}
    />
  )
}


StoreEdit.getInitialProps = async ({ query }) => {

  try {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const { data: product } = await axios.get(`${rootUrl}/api/store/products/${query.id}`)

    return { product }
  } catch (err) {
    return {}
  }
}


export default StoreEdit
