import React, { useState } from 'react'
import settingsContext from './settingsContext'

type Props = {
  settings: {
    enableMenu: boolean,
    enableStore: boolean,
    enableBlog: boolean,
    enableEvents: boolean,
    enableCommenting: boolean,
  },
  children: any
}

const SettingsProvider = (props: Props) => {

  const [settings, setSettings] = useState(props.settings)

  return (
    <settingsContext.Provider
      value={{
        settings,
        setSettings
      }}
    >
      {props.children}
    </settingsContext.Provider>
  )
}

export default SettingsProvider
