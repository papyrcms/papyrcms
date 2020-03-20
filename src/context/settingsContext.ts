import { createContext } from 'react'

type SettingsContext = {
  settings: {
    enableMenu: boolean,
    enableStore: boolean,
    enableBlog: boolean,
    enableEvents: boolean,
    enableCommenting: boolean,
  },
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
