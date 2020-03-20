import { createContext } from 'react'

type SettingsContext = {
  settings: object,
  setSettings: Function
}

export default createContext<SettingsContext>({
  settings: {
    enableMenu: false,
    enableStore: false,
    enableBlog: false,
    enableEvents: false,
    enableCommenting: false,
  },
  setSettings: (settings: object) => {}
})
