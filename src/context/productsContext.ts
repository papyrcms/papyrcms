import { Product } from 'types'
import { createContext } from 'react'

type ProductContext = {
  products: Product[]
  setProducts: Function
}

export default createContext<ProductContext>({
  products: [],
  setProducts: (products: Product[]) => {}
})
