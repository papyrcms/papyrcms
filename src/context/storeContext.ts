import { Product } from '@/types'
import { createContext, useContext } from 'react'

type StoreContext = {
  cart: Product[]
  addToCart: Function
  removeFromCart: Function
  clearCart: Function
  products: Product[]
  setProducts: Function
}

export const storeContext = createContext<StoreContext>({
  cart: [],
  addToCart: (product: Product) => {},
  removeFromCart: (product: Product) => {},
  clearCart: () => {},
  products: [],
  setProducts: (products: Product[]) => {},
})

const useStore = () => useContext(storeContext)
export default useStore
