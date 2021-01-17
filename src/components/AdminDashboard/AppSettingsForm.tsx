import React, { useState, useContext } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { settingsContext } from '@/context'
import Input from '../Input'

const AppSettingsForm: React.FC = () => {
  const [verification, setVerification] = useState('')
  const { settings, setSettings } = useContext(settingsContext)
  const [formSettings, setFormSettings] = useState(settings)

  const handleSubmit = (event: any) => {
    event.preventDefault()

    const confirm = window.confirm(
      'Are you sure you are happy with these settings?'
    )

    if (confirm) {
      axios
        .post('/api/utility/settings', formSettings)
        .then((response) => {
          setSettings(response.data)
          const message = 'Your app settings have been updated.'
          setVerification(message)
        })
        .catch((error) => {
          console.error(error)
          setVerification(error.message)
        })
    }
  }

  const renderSettingsInput = (
    newSetting: any,
    key: string,
    label: string
  ) => {
    switch (typeof newSetting) {
      case 'number':
        return (
          <>
            <Input
              label={label}
              id={key}
              type="number"
              value={newSetting}
              onChange={(event: any) =>
                setFormSettings({
                  ...formSettings,
                  [key]: parseInt(event.target.value),
                })
              }
            />
          </>
        )

      case 'boolean':
      default:
        return (
          <>
            <input
              className="app-settings-form__checkbox"
              type="checkbox"
              id={key}
              checked={newSetting ? true : false}
              onChange={() =>
                setFormSettings({
                  ...formSettings,
                  [key]: !newSetting,
                })
              }
            />
            <label className="app-settings-form__label" htmlFor={key}>
              {label}
            </label>
          </>
        )
    }
  }

  const renderSettingsInputs = () => {
    return _.map(settings, (setting, key) => {
      // Format label
      const result = key.replace(/([A-Z])/g, ' $1')
      const label = result.charAt(0).toUpperCase() + result.slice(1)

      //@ts-ignore not sure how to handle this
      const newSetting = formSettings[key]

      return (
        <div className="app-settings-form__field" key={key}>
          {renderSettingsInput(newSetting, key, label)}
        </div>
      )
    })
  }

  return (
    <form className="app-settings-form" onSubmit={handleSubmit}>
      <h3 className="heading-tertiary app-settings-form__title">
        App Settings
      </h3>

      <p className="app-settings-form__verification">
        {verification}
      </p>

      {renderSettingsInputs()}

      <div className="app-settings-form__submit">
        <input type="submit" className="button button-primary" />
      </div>
    </form>
  )
}

export default AppSettingsForm
