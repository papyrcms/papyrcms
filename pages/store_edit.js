import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../config/keys'
import PostsForm from '../components/PostsForm'
import Input from '../components/Input'


const ProductFields = ({ price, quantity, changeState }) => {
  console.log(price, quantity)
  return(
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
)}

const StoreEdit = props => {
  return (
    <PostsForm
      pageTitle="Edit Product"
      post={props.product}
      apiEndpoint={`/api/products/${props.product._id}`}
      redirectRoute="/store"
      editing
      additionalFields={[ProductFields]}
      additionalState={{
        price: props.product.price,
        quantity: props.product.quantity
      }}
    />
  )
}


StoreEdit.getInitialProps = async ({ query, req }) => {

  let axiosConfig

  // Depending on if we are doing a client or server render
  if (!!req) {
    axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie
      }
    }
  }

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const product = await axios.get(`${rootUrl}/api/products/${query.id}`, axiosConfig)

  return { product: product.data }
}


const mapStateToProps = state => {
  return { product: state.product }
}


export default connect(mapStateToProps)(StoreEdit)