import React from 'react'
import PostsForm from '../../components/PostsForm'
import Input from '../../components/Input'

const ProductFields = ({ price, quantity, changeState }) => (
  <div className="post-form__top">
    <Input
      id="price"
      label="Price"
      name="price"
      value={price || 0.00}
      onChange={event => changeState(event.target.value, 'price')}
      type="number"
    />

    <Input
      id="quantity"
      label="Stock Quantity"
      name="quantity"
      value={quantity || 0}
      onChange={event => changeState(event.target.value, 'quantity')}
      type="number"
    />
  </div>
)

export default () => (
  <PostsForm
    pageTitle="New Product"
    apiEndpoint="/api/products"
    redirectRoute="/store"
    additionalFields={[ProductFields]}
    additionalState={{
      price: 0.00,
      quantity: 0
    }}
  />
)
