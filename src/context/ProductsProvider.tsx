import { Product } from 'types'
import React, { useState } from 'react'
import productsContext from './productsContext'

type Props = {
  products: Product[]
  children: any
}

const ProductsProvider = (props: Props) => {

  const [products, setProducts] = useState(props.products)

  return (
    <productsContext.Provider
      value={{
        products,
        setProducts
      }}
    >
      {props.children}
    </productsContext.Provider>
  )
}

export default ProductsProvider
