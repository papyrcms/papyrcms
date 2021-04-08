import { Settings } from '@/types'
import React, { useState } from 'react'
import settingsContext from './settingsContext'

type Props = {
  settings: Settings
  children: any
}

const SettingsProvider = (props: Props) => {
  const [settings, setSettings] = useState(props.settings)

  return (
    <settingsContext.Provider
      value={{
        settings,
        setSettings,
      }}
    >
      {props.children}
    </settingsContext.Provider>
  )
}

export default SettingsProvider
