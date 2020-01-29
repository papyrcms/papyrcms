import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { setSettings } from '../../reduxStore'


class AppSettingsForm extends Component {

  constructor(props) {

    super(props)

    this.state = { appSettingsVerification: '' }

    Object.keys(props.settings).forEach(key => {
      this.state[key] = props.settings[key]
    })
  }


  handleSubmit(event) {

    event.preventDefault()

    const confirm = window.confirm("Are you sure you are happy with these settings?")

    if (confirm) {

      const newSettings = {}
      const { settings, setSettings } = this.props as any

      Object.keys(settings).forEach(key => {
        newSettings[key] = this.state[key]
      })

      axios.post('/api/utility/settings', newSettings)
        .then(response => {
          setSettings(response.data)
          const message = 'Your app settings have been updated.'
          this.setState({ appSettingsVerification: message })
        }).catch(error => {
          console.error(error)
          this.setState({ appSettingsVerification: error.message })
        })
    }
  }


  renderSettingsInputs() {

    const { settings } = this.props as any
    return Object.keys(settings).map(key => {

      // Format label
      const result = key.replace(/([A-Z])/g, " $1")
      const label = result.charAt(0).toUpperCase() + result.slice(1)

      return (
        <div className="app-settings-form__field" key={key}>
          <input
            className="app-settings-form__checkbox"
            type="checkbox"
            id={key}
            checked={this.state[key] ? true : false}
            onChange={() => this.setState({ [key]: !this.state[key] })}
          />
          <label className="app-settings-form__label" htmlFor={key}>{label}</label>
        </div>
      )
    })
  }


  render() {

    const { appSettingsVerification } = this.state as any

    return (
      <form className="app-settings-form" onSubmit={event => this.handleSubmit(event)}>

        <h3 className="heading-tertiary app-settings-form__title">App Settings</h3>

        <p className="app-settings-form__verification">{appSettingsVerification}</p>

        {this.renderSettingsInputs()}

        <div className="app-settings-form__submit">
          <input type="submit" className="button button-primary" />
        </div>

      </form>
    )
  }
}


const mapStateToProps = state => {
  return { settings: state.settings }
}


export default connect(mapStateToProps, { setSettings })(AppSettingsForm)
