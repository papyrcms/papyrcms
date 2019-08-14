import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { setSettings, setMessages } from '../reduxStore'
import axios from 'axios'
import moment from 'moment-timezone'
import Link from 'next/link'
import keys from '../config/keys'
import Modal from '../components/Modal'

class AdminPage extends Component {

  static async getInitialProps({ req }) {

    const rootUrl = keys.rootURL ? keys.rootURL : ''

    let axiosConfig = {}

    // Depending on if we are doing a client or server render
    if (!!req) {
      axiosConfig = {
        withCredentials: true,
        headers: {
          Cookie: req.headers.cookie
        }
      }
    }

    const userRes = await axios.get(`${rootUrl}/api/users`, axiosConfig)
    const users = userRes.data

    const messageRes = await axios.get(`${rootUrl}/api/messages`, axiosConfig)
    const messages = messageRes.data

    return { users, messages }
  }


  constructor(props) {

    super(props)

    this.state = {
      appSettingsVerification: '',

      hideUserModal: true,
      hideMessageModal: true
    }

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


  renderUsers() {

    const { users } = this.props

    return users.map(user => {

      return (
        <li key={user._id}>
          {user.email}
        </li>
      )
    })
  }


  renderSettingsInputs() {

    return Object.keys(this.props.settings).map(key => {

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


  renderUsersSection() {

    return (
      <div>
        <button
          className="button button-primary"
          onClick={() => this.setState({ hideUserModal: false })}
        >
          View Users ({this.props.users.length})
        </button>
        <Modal 
          hidden={this.state.hideUserModal}
          hideModal={() => this.setState({ hideUserModal: true })}
        >
          <div className="users-section">

            <h3 className="heading-tertiary">Users</h3>

            <ul className="users-section__list">
              {this.renderUsers()}
            </ul>

          </div>
        </Modal>
      </div>
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


  renderBlogMenuItems() {

    const { settings } = this.props

    if (settings.enableBlog) {
      return (
        <Fragment>
          <Link href="/blog_create" as="/blog/new">
            <a className="admin-page__link">Add Blog</a>
          </Link>

          <Link href="/blog_all" as="/blog/all">
            <a className="admin-page__link">My Blogs</a>
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


  renderAdminMenu() {

    return (
      <Fragment>
        <Link href="/posts_create" as="/posts/new">
          <a className="admin-page__link">Add Content</a>
        </Link>

        <Link href="/posts_all" as="/posts">
          <a className="admin-page__link">My Content</a>
        </Link>

        {this.renderBlogMenuItems()}
        {this.renderEventMenuItems()}
        {this.renderStoreMenuItems()}
      </Fragment>
    )
  }


  deleteMessage(id) {

    const confirm = window.confirm("Are you sure you want to delete this message?")

    if (confirm) {

      const { messages, setMessages } = this.props

      axios.delete(`/api/messages/${id}`)
        .then(res => {
          messages.forEach((message, i) => {

            if (message._id === id) {
              let newMessages = [...messages]
              newMessages.splice(i, 1)

              setMessages(newMessages)
            }
          })

        }).catch(err => {
          console.error(err)
        })
    }
  }


  renderMessages() {

    const { messages } = this.props

    return messages.map(mess => {

      const { name, email, message, created, _id } = mess

      return (
        <div key={_id} className="message-section__message">
          <p className="message-section__date">Sent: {moment(created).tz('America/Chicago').format('MMMM Do, YYYY')}</p>

          <div className="message-section__info">
            <span className="message-section__info--name">From: {name}</span>
            <span className="message-section__info--email">Email: {email}</span>
          </div>

          <div className="message-section__content">
            {message}
          </div>

          <button 
            className="button button-tertiary button-small"
            onClick={() => this.deleteMessage(_id)}
          >
            Delete
          </button>
        </div>
      )
    })
  }


  renderMessagesSection() {

    return (
      <div>
        <button
          className="button button-primary"
          onClick={() => this.setState({ hideMessageModal: false })}
        >
          View Messages ({this.props.messages.length})
        </button>
        <Modal
          hidden={this.state.hideMessageModal}
          hideModal={() => this.setState({ hideMessageModal: true })}
        >
          <div className="messages-section">
            <h3 className="heading-tertiary">Messages</h3>
            {this.renderMessages()}
          </div>
        </Modal>
      </div>
    )
  }


  render() {

    const { appSettingsVerification } = this.state

    return (
      <div className="admin-page">

        <h2 className="heading-secondary admin-page__title">Admin Dashboard</h2>

        <div className="admin-page__dashboard">

          <div className="admin-page__links">
            {this.renderAdminMenu()}
          </div>

          <div className="admin-page__forms">
            <p className="admin-page__verification">{appSettingsVerification}</p>

            {this.renderAppSettingsForm()}
            {this.renderUsersSection()}
            {this.renderMessagesSection()}
          </div>

        </div>

      </div>
    )
  }
}


const mapStateToProps = state => {
  return { settings: state.settings, users: state.users, messages: state.messages }
}


export default connect(mapStateToProps, { setSettings, setMessages })(AdminPage)
