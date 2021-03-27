import { Keys } from 'types'
import { createContext } from 'react'

export default createContext<{ keys: Keys }>({
  keys: {
    stripePublishableKey: '',
    googleMapsKey: '',
    googleAnalyticsId: '',
    tinyMceKey: '',
  },
})
