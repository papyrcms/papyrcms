import React, { useState, useContext } from 'react'
import axios from 'axios'
import _ from 'lodash'
import settingsContext from '../../context/settingsContext'


const AppSettingsForm = () => {

  const [verification, setVerification] = useState('')
  const { settings, setSettings } = useContext(settingsContext)
  const [formSettings, setFormSettings] = useState(settings)

  const handleSubmit = (event: React.FormEvent) => {

    event.preventDefault()

    const confirm = window.confirm("Are you sure you are happy with these settings?")

    if (confirm) {
      axios.post('/api/utility/settings', formSettings)
        .then(response => {
          setSettings(response.data)
          const message = 'Your app settings have been updated.'
          setVerification(message)
        }).catch(error => {
          console.error(error)
          setVerification(error.message)
        })
    }
  }


  const renderSettingsInputs = () => {

    return _.map(settings, (setting, key: keyof typeof settings) => {

      // Format label
      const result = key.replace(/([A-Z])/g, " $1")
      const label = result.charAt(0).toUpperCase() + result.slice(1)

      return (
        <div className="app-settings-form__field" key={key}>
          <input
            className="app-settings-form__checkbox"
            type="checkbox"
            id={key}
            checked={formSettings[key] ? true : false}
            onChange={() => setFormSettings({ ...formSettings, [key]: !formSettings[key] })}
          />
          <label className="app-settings-form__label" htmlFor={key}>{label}</label>
        </div>
      )
    })
  }


  return (
    <form className="app-settings-form" onSubmit={handleSubmit}>

      <h3 className="heading-tertiary app-settings-form__title">App Settings</h3>

      <p className="app-settings-form__verification">{verification}</p>

      {renderSettingsInputs()}

      <div className="app-settings-form__submit">
        <input type="submit" className="button button-primary" />
      </div>

    </form>
  )
}


export default AppSettingsForm
