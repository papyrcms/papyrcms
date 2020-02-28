import React, { useContext } from 'react'
import userContext from '../../context/userContext'
import PostsForm from '../../components/PostsForm'
import Input from '../../components/Input'

const ProductFields = ({ values, errors, validateField, handleChange }) => (
  <div className="u-form-row">
    <Input
      id="price"
      label="Price"
      name="price"
      value={values.price || 0.00}
      onChange={handleChange}
      validation={errors.price}
      onBlur={validateField}
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

export default () => {

  const { currentUser } = useContext(userContext)
  if (!currentUser || !currentUser.isAdmin) return null

  return (
    <PostsForm
      pageTitle="New Product"
      apiEndpoint="/api/store/products"
      redirectRoute="/store"
      additionalFields={[ProductFields]}
      additionalState={{
        price: 0.00,
        quantity: 0
      }}
    />
  )
}
