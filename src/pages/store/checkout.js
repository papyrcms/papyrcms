import React, { useState } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../../config/keys'
import { setCurrentUser } from '../../reduxStore'
import CreditCardForm from '../../components/CreditCardForm'
import Input from '../../components/Input'
import UserInfoForm from '../../components/UserInfoForm'
import useCart from '../../hooks/useCart'


const Checkout = props => {

  const { product, currentUser, setCurrentUser } = props

  let cart = []
  let fromCart
  let cartState
  if (product) {
    cart = [product]
  } else {
    cartState = useCart(currentUser, setCurrentUser)
    cart = cartState.cart
    fromCart = true
  }

  const [orderNotes, setOrderNotes] = useState("")
  const [handleSubmitSuccess, setHandleSubmitSuccess] = useState(() => null)
  const [handleSubmitError, setHandleSubmitError] = useState(() => null)

  const handleCardSubmit = (source, setProcessing, setValidation) => {
    const errorFunction = () => {
      setProcessing(false)
      setValidation('Something went wrong.')
    }
    setHandleSubmitError(() => errorFunction)


    const successFunction = formState => {
      const additionalValues = {
        fromCart,
        source,
        notes: orderNotes,
        products: cart
      }

      const success = () => {
        setProcessing(false)
        setValidation('Your order has been sent!')
        if (fromCart) {
          cartState.clearCart()
        }
      }

      const error = err => {
        setProcessing(false)
        if (err.response) {
          setValidation(err.response.data.message)
        }
      }

      formState.submitForm(
        '/api/store/checkout',
        { success, error },
        false,
        additionalValues
      )
    }
    setHandleSubmitSuccess(() => successFunction)

    document.getElementById('userInfoForm').dispatchEvent(new Event('submit'))
  }

  const renderProductsList = () => {
    return cart.map((product, i) => {
      return <p key={product._id + i.toString()}>{product.title}: ${product.price.toFixed(2)}</p>
    })
  }

  const renderTotalCost = () => {
    let totalCost = 0
    cart.forEach(product => totalCost += product.price)
    return <p className="u-margin-bottom-small">Total Cost: ${totalCost.toFixed(2)}</p>
  }

  return (
    <section className="checkout">
      <div className="checkout__container">

        <h2 className="heading-secondary">Checkout</h2>

        <UserInfoForm
          useSubmit={false}
          onSubmitSuccess={handleSubmitSuccess}
          onSubmitError={handleSubmitError}
        >
          <Input
            type="textarea"
            label="Additional notes about the order"
            name="orderNotes"
            value={orderNotes}
            onChange={event => setOrderNotes(event.target.value)}
          />

          {renderProductsList()}
          <hr />
          {renderTotalCost()}

          <CreditCardForm onSubmit={handleCardSubmit} />
        </UserInfoForm>

      </div>
    </section>
  )
}


Checkout.getInitialProps = async ({ req, query }) => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''

  // Depending on if we are doing a client or server render
  let axiosConfig = {}
  if (!!req) {
    axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie || ''
      }
    }
  }

  let product
  if (query.id) {
    const res = await axios.get(`${rootUrl}/api/store/products/${query.id}`, axiosConfig)
    product = res.data
  }
  const { data: stripePubKey } = await axios.post(`${rootUrl}/api/stripePubKey`)

  return { product, stripePubKey }
}


const mapStateToProps = state => {
  return { product: state.product, currentUser: state.currentUser }
}


export default connect(mapStateToProps, { setCurrentUser })(Checkout)
