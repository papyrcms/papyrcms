import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../../config/keys'
import PostsForm from '../../components/PostsForm'
import Input from '../../components/Input'


const ProductFields = ({ values, errors, validateField, handleChange }) => {

  return(
    <div className="post-form__top">
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

  const { product } = props

  return (
    <PostsForm
      pageTitle="Edit Product"
      post={product}
      apiEndpoint={`/api/products/${product._id}`}
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


StoreEdit.getInitialProps = async context => {

  let { id, product } = context.query

  if (!product) {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const res = await axios.get(`${rootUrl}/api/products/${id}`)
    product = res.data
  }

  return { product }
}


const mapStateToProps = state => {
  return { product: state.product }
}


export default connect(mapStateToProps)(StoreEdit)