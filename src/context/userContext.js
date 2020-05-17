import { createContext } from 'react'

export default createContext({
  currentUser: {
    _id: '',

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
    created: new Date(),

    // Etc
    isAdmin: false,
    isSubscribed: false,
    isBanned: false
  },
  setCurrentUser: (user) => {}
})
