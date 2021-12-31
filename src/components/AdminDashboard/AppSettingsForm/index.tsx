import { useState } from 'react'
import axios from 'axios'
import { useSettings } from '@/context'
import Input from '../../Input'
import styles from './AppSettingsForm.module.scss'
import { AppSettings } from '@/types'

const AppSettingsForm: React.FC = () => {
  const [verification, setVerification] = useState('')
  const { settings, setSettings } = useSettings()
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
    newSetting: number | boolean,
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
                  [key]: parseFloat(event.target.value),
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
              className={styles.checkbox}
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
            <label className={styles.label} htmlFor={key}>
              {label}
            </label>
          </>
        )
    }
  }

  const renderSettingsInputs = () => {
    return Object.keys(settings).map((key) => {
      // Format label
      const result = key.replace(/([A-Z])/g, ' $1')
      const label = result.charAt(0).toUpperCase() + result.slice(1)

      const newSetting = formSettings[key as keyof AppSettings]

      return (
        <div className={styles.field} key={key}>
          {renderSettingsInput(newSetting, key, label)}
        </div>
      )
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className="heading-tertiary">App Settings</h3>

      <p className={styles.verification}>{verification}</p>

      {renderSettingsInputs()}

      <div className={styles.submit}>
        <input type="submit" className="button button-primary" />
      </div>
    </form>
  )
}

export default AppSettingsForm
