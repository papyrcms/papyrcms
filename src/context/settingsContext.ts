import { Settings } from '@/types'
import { createContext } from 'react'

type SettingsContext = {
  settings: Settings
  setSettings: Function
}

export default createContext<SettingsContext>({
  settings: {
    enableMenu: false,
    enableStore: false,
    storeMenuLocation: 0,
    enableBlog: false,
    blogMenuLocation: 0,
    enableEvents: false,
    eventsMenuLocation: 0,
    enableCommenting: false,
    enableRegistration: false,
    enableEmailingToAdmin: false,
    enableEmailingToUsers: false,
  },
  setSettings: (settings: Settings) => {},
})
