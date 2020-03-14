import { createContext } from 'react'

export default createContext({
  settings: {
    enableMenu: false,
    enableStore: false,
    enableBlog: false,
    enableEvents: false,
    enableCommenting: false,
  },
  setSettings: (settings: object) => {}
})
