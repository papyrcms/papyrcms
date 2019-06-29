import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { setSettings } from '../store'
import axios from 'axios'
import Link from 'next/link'
import keys from '../config/keys'

class AdminPage extends Component {

  static async getInitialProps(context) {

    let users = []

    if (!!context.res) {
      users = context.query.users
    } else {
      const rootUrl = keys.rootURL ? keys.rootURL : ''
      const response = await axios.get(`${rootUrl}/api/admin/users`)
      users = response.data
    }

    return { users }
  }


  constructor(props) {

    super(props)

    const {
      enableMenu,
      enableCommenting,
      enableEmailing,
      enableDonations,
      enableRegistration,
      enableStore
    } = props.settings

    this.state = {
      enableMenu,
      enableCommenting,
      enableEmailing,
      enableDonations,
      enableRegistration,
      enableStore,

      appSettingsVerification: '',

      users: props.users,
    }
  }


  handleSubmit(event, settings) {

    event.preventDefault()

    const confirm = window.confirm("Are you sure you are happy with these settings?")

    if (confirm) {
      axios.post('/api/admin/settings', settings)
        .then(response => {
          if (!!response.data._id) {
            const message = 'Your app settings have been updated.'

            this.props.setSettings(response.data)
            this.setState({ appSettingsVerification: message })
          }
        }).catch(error => {
          console.error(error)
        })
    }
  }


  renderUsers() {

    const { users } = this.state

    return _.map(users, user => {
      return (
        <li key={user._id}>
          {user.email}
        </li>
      )
    })
  }


  renderAppSettingsForm() {

    const {
      enableMenu,
      enableCommenting,
      enableEmailing,
      enableDonations,
      enableRegistration,
      enableStore,
    } = this.state

    const settings = {
      enableMenu,
      enableCommenting,
      enableEmailing,
      enableDonations,
      enableRegistration,
      enableStore
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
            id="enable-donations"
            checked={enableDonations ? true : false}
            onChange={() => this.setState({ enableDonations: !enableDonations })}
          />
          <label className="settings-form__label" htmlFor="enable-donations">Enable Donations</label>
        </div>

        <div className="settings-form__field">
          <input
            className="settings-form__checkbox"
            type="checkbox"
            id="enable-registration"
            checked={enableRegistration ? true : false}
            onChange={() => this.setState({ enableRegistration: !enableRegistration })}
          />
          <label className="settings-form__label" htmlFor="enable-registration">Enable User Registration</label>
        </div>

        <div className="settings-form__field">
          <input
            className="settings-form__checkbox"
            type="checkbox"
            id="enable-store"
            checked={enableStore ? true : false}
            onChange={() => this.setState({ enableStore: !enableStore })}
          />
          <label className="settings-form__label" htmlFor="enable-store">Enable Store</label>
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
          {this.renderUsers()}
        </ul>

      </form>
    )
  }


  renderStoreMenuItems() {

    const { settings } = this.props

    if (settings.enableStore) {
      return (
        <Fragment>
          <Link href="/store_create" as="/store/new">
            <a className="admin-page__link">Add Product</a>
          </Link>

          <Link href="/store_all" as="/store">
            <a className="admin-page__link">My Products</a>
          </Link>
        </Fragment>
      )
    }
  }


  render() {

    const { appSettingsVerification } = this.state

    return (
      <div className="admin-page">

        <h2 className="heading-secondary admin-page__title">Admin Dashboard</h2>

        <div className="admin-page__links">
          <Link href="/posts_create" as="/posts/new">
            <a className="admin-page__link">Add Post</a>
          </Link>

          <Link href="/posts_all" as="/posts">
            <a className="admin-page__link">My Posts</a>
          </Link>

          <Link href="/blog_create" as="/blog/new">
            <a className="admin-page__link">Add Blog</a>
          </Link>

          <Link href="/blog_all" as="/blog/all">
            <a className="admin-page__link">My Blogs</a>
          </Link>

          {this.renderStoreMenuItems()}
        </div>

        <p className="admin-page__verification">{appSettingsVerification}</p>

        <div className="admin-page__forms">
          {this.renderAppSettingsForm()}
          {/* {this.renderUsersForm()} */}
        </div>

      </div>
    )
  }
}


const mapStateToProps = state => {
  return { settings: state.settings, users: state.users }
}


export default connect(mapStateToProps, { setSettings })(AdminPage)
