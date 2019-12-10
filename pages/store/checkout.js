import React, { useState } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../../config/keys'
import CreditCardForm from '../../components/CreditCardForm'
import Input from '../../components/Input'


const useForm = initialState => {

  const [values, setValues] = useState(initialState)

  const handleChange = event => {
    const { name, value } = event.target
    setValues(prevValues => ({ ...prevValues, [name]: value }))
  }

  const handleSubmit = (stripeSource, setProcessing, setValidation) => {
    console.log(stripeSource)
  }

  return { values, handleChange, handleSubmit }
}


const Checkout = props => {

  const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',

    shippingFirstName: '',
    shippingLastName: '',
    shippingEmail: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: '',

    shipToBilling: true,
    orderNotes: ''
  }

  const { product, currentUser } = props

  const { values, handleChange, handleSubmit } = useForm(INITIAL_STATE);

  return (
    <section className="checkout">
      <Input
        id="firstName"
        name="firstName"
        label="First Name"
        value={values.firstName}
        onChange={handleChange}
      />

      <Input
        id="lastName"
        name="lastName"
        label="Last Name"
        value={values.lastName}
        onChange={handleChange}
      />

      <Input
        id="email"
        name="email"
        label="Email"
        type="email"
        value={values.email}
        onChange={handleChange}
      />

      <CreditCardForm onSubmit={handleSubmit} />
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
