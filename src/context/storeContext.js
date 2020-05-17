import { createContext } from 'react'


export default createContext({
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (product) => {},
  clearCart: () => {}
})
