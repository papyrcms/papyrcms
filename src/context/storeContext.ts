import { createContext } from 'react'

type StoreContext = {
  cart: Array<Product>,
  addToCart: Function,
  removeFromCart: Function,
  clearCart: Function
}

export default createContext<StoreContext>({
  cart: [],
  addToCart: (product: Product) => {},
  removeFromCart: (product: Product) => {},
  clearCart: () => {}
})
