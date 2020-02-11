import { createContext } from 'react';

export default createContext({
  orders: [],
  products: [],
  cart: [],
  addToCart: product => {},
  removeFromCart: product => {},
  clearCart: () => {}
})
