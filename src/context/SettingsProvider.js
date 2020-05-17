import React, { useState } from 'react'
import settingsContext from './settingsContext'

const SettingsProvider = (props) => {

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
