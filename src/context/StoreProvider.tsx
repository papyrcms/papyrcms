import { Product } from 'types'
import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import _ from 'lodash'
import StoreContext from './storeContext'
import UserContext from './userContext'

type Props = {
  children: any
}

const StoreProvider = (props: Props) => {

  const [cart, setCart] = useState<Product[]>([])
  const { currentUser } = useContext(UserContext)


  useEffect(() => {
    if (currentUser?.cart) {
      setCart(currentUser.cart)
    } else {
      const localCart = localStorage.getItem('cart')
      if (localCart) {
        const foundCart = JSON.parse(localCart)
        setCart(foundCart)
      }
    }
  }, [currentUser])


  const addToCart = async (product: Product) => {
    const newCart = [...cart, product]
    if (!currentUser) {
      if (_.filter(cart, inCart => inCart._id === product._id).length < product.quantity) {
        localStorage.setItem('cart', JSON.stringify(newCart))
        setCart(newCart)
      }
    } else {
      try {
        await axios.put(`/api/store/cart/${product._id}`)
        setCart(newCart)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const removeFromCart = async (product: Product) => {
    let removed = false
    const newCart = _.filter(cart, item => {
      if (item._id === product._id && !removed) {
        removed = true
        return false
      }
      return true
    })

    if (!currentUser) {
      if (_.filter(cart, inCart => inCart._id === product._id).length > 0) {
        localStorage.setItem('cart', JSON.stringify(newCart))
        setCart(newCart)
      }
    } else {
      try {
        await axios.delete(`/api/store/cart/${product._id}`)
        setCart(newCart)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const clearCart = () => {
    setCart([])
    if (!currentUser) {
      localStorage.setItem('cart', JSON.stringify([]))
    }
  }

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart
      }}
    >
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreProvider
