import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { setSettings } from '../store'
import axios from 'axios'
import keys from '../config/keys'

class AdminPage extends Component {

  static async getInitialProps( context ) {

    let users = []

    if ( !!context.res ) {
      users = context.query.users
    } else {
      const rootUrl = keys.rootURL ? keys.rootURL : ''
      const response = await axios.get(`${rootUrl}/api/admin/users`)
      users = response.data
    }

    return { users }
  }

  
  constructor( props ) {

    super( props )

    const {
      enableMenu,
      enableCommenting,
      enableEmailing,
      enableUserPosts,
      enableDonations
    } = props.settings

    this.state = {
      enableMenu,
      enableCommenting,
      enableEmailing,
      enableUserPosts,
      enableDonations,

      appSettingsVerification: '',

      users: props.users,
    }
  }


  handleSubmit( event, settings ) {

    event.preventDefault()

    axios.post( '/api/admin/settings', settings )
      .then( response => {
        if ( !!response.data._id ) {
          const message = 'Your app settings have been updated.'

          this.props.setSettings( response.data )
          this.setState({ appSettingsVerification: message })
        }
      }).catch( error => {
        console.error(error)
      })
  }


  renderUsers() {

    const { users } = this.state

    return _.map( users, user => {
      return (
        <li key={ user._id }>
          { user.email }
        </li>
      )
    })
  }


  renderAppSettingsForm() {

    const {
      enableMenu,
      enableCommenting,
      enableEmailing,
      enableUserPosts,
      enableDonations,
    } = this.state

    const settings = {
      enableMenu,
      enableCommenting,
      enableEmailing,
      enableUserPosts,
      enableDonations
    }

    return (
      <form className="settings-form" onSubmit={event => this.handleSubmit(event, settings)}>

        <h3 className="heading-tertiary settings-form__title">App Settings</h3>

        <div className="settings-form__field">
          <input
            className="settings-form__checkbox"
            type="checkbox"
            id="enable-emailing"
            checked={enableEmailing ? true : false}
            onChange={() => this.setState({ enableEmailing: !enableEmailing })}
          />
          <label className="settings-form__label" htmlFor="enable-emailing">Enable Emailing</label>
        </div>

        <div className="settings-form__field">
          <input
            className="settings-form__checkbox"
            type="checkbox"
            id="enable-menu"
            checked={enableMenu ? true : false}
            onChange={() => this.setState({ enableMenu: !enableMenu })}
          />
          <label className="settings-form__label" htmlFor="enable-menu">Enable Menu</label>
        </div>

        <div className="settings-form__field">
          <input
            className="settings-form__checkbox"
            type="checkbox"
            id="enable-commenting"
            checked={enableCommenting ? true : false}
            onChange={() => this.setState({ enableCommenting: !enableCommenting })}
          />
          <label className="settings-form__label" htmlFor="enable-commenting">Enable Commenting</label>
        </div>

        <div className="settings-form__field">
          <input
            className="settings-form__checkbox"
            type="checkbox"
            id="enable-user-posts"
            checked={enableUserPosts ? true : false}
            onChange={() => this.setState({ enableUserPosts: !enableUserPosts })}
          />
          <label className="settings-form__label" htmlFor="enable-user-posts">Enable User Posting</label>
        </div>

        <div className="settings-form__field">
          <input
            className="settings-form__checkbox"
            type="checkbox"
            id="enable-donations"
            checked={enableDonations ? true : false}
            onChange={() => this.setState({ enableDonations: !enableDonations })}
          />
          <label className="settings-form__label" htmlFor="enable-donations">Enable Donations</label>
        </div>

        <div className="settings-form__submit">
          <input type="submit" className="button button-primary" />
        </div>

      </form>
    )
  }


  renderUsersForm() {

    return (
      <form className="users-form">

        <h3 className="heading-tertiary">Users</h3>

        <ul className="users-form__list">
          { this.renderUsers() }
        </ul>

      </form>
    )
  }


  render() {

    const { appSettingsVerification } = this.state

    return (
      <div className="admin-page">
        <h2 className="heading-secondary admin-page__title">Admin Dashboard</h2>
        <p className="admin-page__verification">{ appSettingsVerification }</p>
        <div className="admin-page__forms">
          { this.renderAppSettingsForm() }
          { this.renderUsersForm() }
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { settings: state.settings, users: state.users }
}


export default connect( mapStateToProps, { setSettings } )( AdminPage )
