import { AppSettings } from '@/types'
import { createContext, useContext } from 'react'

type SettingsContext = {
  settings: AppSettings
  setSettings: Function
}

export const settingsContext = createContext<SettingsContext>({
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
  setSettings: (settings: AppSettings) => {},
})

const useSettings = () => useContext(settingsContext)
export default useSettings
