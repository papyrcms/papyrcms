import { createContext } from 'react'

export default createContext({
  keys: {
    stripePublishableKey: '',
    googleMapsKey: '',
    googleAnalyticsId: ''
  }
})
