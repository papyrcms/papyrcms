import { Product } from 'types'
import { createContext } from 'react'

type StoreContext = {
  cart: Product[]
  addToCart: Function
  removeFromCart: Function
  clearCart: Function
  products: Product[]
  setProducts: Function
}

export default createContext<StoreContext>({
  cart: [],
  addToCart: (product: Product) => {},
  removeFromCart: (product: Product) => {},
  clearCart: () => {},
  products: [],
  setProducts: (products: Product[]) => {},
})
