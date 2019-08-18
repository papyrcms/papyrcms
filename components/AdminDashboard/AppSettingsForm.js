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

      const settings = {}

      Object.keys(this.props.settings).forEach(key => {
        settings[key] = this.state[key]
      })

      axios.post('/api/admin/settings', settings)
        .then(response => {
          const message = 'Your app settings have been updated.'

          const newSettings = {}

          Object.keys(response.data).forEach(key => {
            switch (response.data[key]) {
              case 'true':
                newSettings[key] = true
                break
              case 'false':
                newSettings[key] = false
                break
              default: value
            }
          })

          this.props.setSettings(newSettings)
          this.setState({ appSettingsVerification: message })
        }).catch(error => {
          console.error(error)
        })
    }
  }


  renderSettingsInputs() {

    return Object.keys(this.props.settings).map(key => {

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

    const { appSettingsVerification } = this.state

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
