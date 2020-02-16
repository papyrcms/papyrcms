import { createContext } from 'react'

export default createContext({
  currentUser: {
    _id: '',
    username: '',
    password: '',

    // Personal Info
    email: '',
    firstName: '',
    lastName: '',

    // Billing info
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',

    // Shipping info
    shippingFirstName: '',
    shippingLastName: '',
    shippingEmail: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: '',

    // Shop info
    cart: [],

    // Account creation date
    created: '',

    // Etc
    isAdmin: null,
    isSubscribed: null,
    isBanned: null
  },
  setCurrentUser: user => {}
})
