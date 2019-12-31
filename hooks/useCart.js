import { useState, useEffect } from 'react'
import axios from 'axios'


const useCart = (currentUser, setCurrentUser) => {

  const [cart, setCart] = useState(currentUser ? currentUser.cart : [])

  useEffect(() => {
    if (!currentUser) {
      const localCart = JSON.parse(localStorage.getItem('cart')) || []
      setCart(localCart)
    }
  }, [])

  const addToCart = async product => {

    const newCart = [...cart, product]
    if (!currentUser) {

      if (cart.filter(inCart => inCart._id === product._id).length < product.quantity) {
        localStorage.setItem('cart', JSON.stringify(newCart))
        setCart(newCart)
      }

    } else {

      try {
        const response = await axios.put(`/api/cart/${product._id}`)
        setCurrentUser({ ...currentUser, cart: newCart })
        setCart(newCart)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const removeFromCart = async product => {

    let removed = false
    const newCart = cart.filter(item => {
      if (item._id === product._id && !removed) {
        removed = true
        return false
      }
      return true
    })

    if (!currentUser) {

      if (cart.filter(inCart => inCart._id === product._id).length > 0) {
        localStorage.setItem('cart', JSON.stringify(newCart))
        setCart(newCart)
      }

    } else {

      try {
        const response = await axios.delete(`/api/cart/${product._id}`)
        setCurrentUser({ ...currentUser, cart: newCart })
        setCart(newCart)
      } catch (err) {
        console.error(err)
      }
    }
  }

  return { addToCart, removeFromCart, cart }
}

export default useCart
