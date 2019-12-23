import React, { useState } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../../config/keys'
import CreditCardForm from '../../components/CreditCardForm'
import Input from '../../components/Input'
import UserInfoForm from '../../components/UserInfoForm'


const Checkout = props => {

  const { product } = props

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
        source,
        notes: orderNotes,
        products: [product]
      }

      const success = () => {
        setProcessing(false)
        setValidation('Your order has been sent!')
      }

      const error = err => {
        setProcessing(false)
        setValidation(err.response.data.message)
      }

      formState.submitForm(
        '/api/checkout',
        { success, error },
        false,
        additionalValues
      )
    }
    setHandleSubmitSuccess(() => successFunction)

    document.getElementById('userInfoForm').dispatchEvent(new Event('submit'))
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

          <p>{product.title}: ${product.price.toFixed(2)}</p>

          <CreditCardForm onSubmit={handleCardSubmit} />
        </UserInfoForm>

      </div>
    </section>
  )
}


Checkout.getInitialProps = async (context) => {

  let { id, product } = context.query

  const rootUrl = keys.rootURL ? keys.rootURL : ''

  if (!product) {
    const res = await axios.get(`${rootUrl}/api/products/${id}`)
    product = res.data
  }

  const stripePubKeyRes = await axios.post(`${rootUrl}/api/stripePubKey`)
  const stripePubKey = stripePubKeyRes.data

  return { product, stripePubKey }
}


const mapStateToProps = state => {
  return { product: state.product, currentUser: state.currentUser }
}


export default connect(mapStateToProps)(Checkout)
