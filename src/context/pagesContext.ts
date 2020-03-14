import { createContext } from 'react'

export default createContext({
  pages: [{
    title: '',
    className: '',
    navOrder: 0,
    route: '',
    _id: ''
  }],
  setPages: (pages: Array<object>) => {}
})
