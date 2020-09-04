import { Product } from 'types'
import { createContext } from 'react'

type StoreContext = {
  cart: Product[]
  addToCart: Function
  removeFromCart: Function
  clearCart: Function
}

export default createContext<StoreContext>({
  cart: [],
  addToCart: (product: Product) => {},
  removeFromCart: (product: Product) => {},
  clearCart: () => {}
})
