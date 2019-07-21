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

    this.state = {
      appSettingsVerification: '',

      users: props.users,
    }

    _.map(props.settings, (value, key) => {
      this.state[key] = value
    })
  }


  handleSubmit(event) {

    event.preventDefault()

    const confirm = window.confirm("Are you sure you are happy with these settings?")
    
    if (confirm) {

      const settings = {}
  
      _.map(this.props.settings, (value, key) => {
        settings[key] = this.state[key]
      })

      axios.post('/api/admin/settings', settings)
        .then(response => {
          const message = 'Your app settings have been updated.'

          const newSettings = {}

          _.map(response.data, (value, key) => {
            switch (value) {
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


  renderSettingsInputs() {

    console.log(this.props.settings)

    return _.map(this.props.settings, (value, key) => {

      // Format label
      const result = key.replace(/([A-Z])/g, " $1")
      const label = result.charAt(0).toUpperCase() + result.slice(1)

      return (
        <div className="settings-form__field" key={key}>
          <input
            className="settings-form__checkbox"
            type="checkbox"
            id={key}
            checked={this.state[key] ? true : false}
            onChange={() => this.setState({ [key]: !this.state[key] })}
          />
          <label className="settings-form__label" htmlFor={key}>{label}</label>
        </div>
      )
    })
  }


  renderAppSettingsForm() {

    return (
      <form className="settings-form" onSubmit={event => this.handleSubmit(event)}>

        <h3 className="heading-tertiary settings-form__title">App Settings</h3>

        {this.renderSettingsInputs()}

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


  renderEventMenuItems() {

    const { settings } = this.props

    if (settings.enableEvents) {
      return (
        <Fragment>
          <Link href="/events_create" as="/events/new">
            <a className="admin-page__link">Add Event</a>
          </Link>

          <Link href="/events_all" as="/events/all">
            <a className="admin-page__link">My Events</a>
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
            <a className="admin-page__link">Add Content</a>
          </Link>

          <Link href="/posts_all" as="/posts">
            <a className="admin-page__link">My Content</a>
          </Link>

          <Link href="/blog_create" as="/blog/new">
            <a className="admin-page__link">Add Blog</a>
          </Link>

          <Link href="/blog_all" as="/blog/all">
            <a className="admin-page__link">My Blogs</a>
          </Link>

          {this.renderEventMenuItems()}
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
