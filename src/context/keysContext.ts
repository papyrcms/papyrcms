import { Keys } from '@/types'
import { createContext, useContext } from 'react'

export const keysContext = createContext<{ keys: Keys }>({
  keys: {
    stripePublishableKey: '',
    googleMapsKey: '',
    googleAnalyticsId: '',
    tinyMceKey: '',
  },
})

const useKeys = () => useContext(keysContext)
export default useKeys
