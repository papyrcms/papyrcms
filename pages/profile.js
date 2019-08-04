import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'
import { setCurrentUser } from '../reduxStore'
import Input from '../components/Input'

class ProfilePage extends Component {

  constructor(props) {

    super(props)

    if (!!props.currentUser) {
      this.state = {
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
        passwordValidation: '',
        firstName: props.currentUser.firstName || '',
        lastName: props.currentUser.lastName || '',
        infoValidation: ''
      }
    } else {
      this.state = {
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
        passwordValidation: '',
        firstName: '',
        lastName: '',
        infoValidation: ''
      }
    }
  }


  onLogoutClick() {

    axios.get('/api/logout')
      .then(res => {
        if (res.data === 'logged out') {
          Router.push('/')
          this.props.setCurrentUser(null)
        }
      }).catch(err => {
        console.error(err)
      })
  }


  handleInfoSubmit(event) {

    event.preventDefault()

    const { firstName, lastName } = this.state
    const infoData = { firstName, lastName, userId: this.props.currentUser._id }

    axios.put('/api/currentUser', infoData)
      .then(res => {
        if (!!res.data.error) {
          return this.setState({ infoValidation: res.data.error })
        } else {
          axios.get('/api/currentUser')
            .then(res => {
              this.props.setCurrentUser(res.data)
              this.setState({ infoValidation: 'User info updated.' })
            }).catch(err => {
              console.error(err)
            })
        }
      }).catch(err => {
        console.error(err)
      })
  }


  handlePasswordSubmit(event) {

    event.preventDefault()

    const { oldPassword, newPassword, newPasswordConfirm } = this.state
    const passwordData = { oldPassword, newPassword, newPasswordConfirm, userId: this.props.currentUser._id }

    axios.post('/api/changePassword', passwordData)
      .then(res => {
        this.setState({
          passwordValidation: res.data.message,
          oldPassword: '',
          newPassword: '',
          newPasswordConfirm: ''
        })
      }).catch(err => {
        this.setState({ passwordValidation: err.response.data.message })
      })
  }


  renderAdmin() {

    if (this.props.currentUser.isAdmin) {
      return (
        <div>
          <p>You are an admin.</p>
          <Link href="/admin" as="/admin">
            <button className="button button-primary">Admin Dashboard</button>
          </Link>
        </div>
      )
    }
  }


  renderProfilePage() {

    const { currentUser } = this.props
    const { firstName, lastName, infoValidation, oldPassword, newPassword, newPasswordConfirm, passwordValidation } = this.state

    if (!!currentUser) {
      return (
        <div className="profile">
          <h1 className="heading-secondary">Profile</h1>

          <div className="profile__credentials">
            <div className="profile__logout">
              <span>Not {!!currentUser.firstName ? currentUser.firstName : currentUser.email}?</span>
              <button
                onClick={() => this.onLogoutClick()}
                className="button button-primary"
              >
                Log Out
              </button>
            </div>
            {this.renderAdmin()}
          </div>

          <div className="profile__info">
            <p className="u-margin-bottom-small">Email: {currentUser.email}</p>

            {/* Personal Info Form */}
            <form className="profile__form" onSubmit={this.handleInfoSubmit.bind(this)}>

              <div className="profile__name-inputs">
                <Input
                  id="profile-first-name"
                  label="First Name"
                  name="firstName"
                  value={firstName}
                  onChange={event => this.setState({ firstName: event.target.value })}
                />

                <Input
                  id="profile-last-name"
                  label="Last Name"
                  name="lastName"
                  value={lastName}
                  onChange={event => this.setState({ lastName: event.target.value })}
                />
              </div>

              <p className="profile__validation">{infoValidation}</p>
              <input
                className="button button-primary"
                type="submit"
              />
            </form>
          </div>

          <div className="profile__password">
            {/* Change Password Form */}
            <h3>Reset Password</h3>
            <form className="profile__form" onSubmit={this.handlePasswordSubmit.bind(this)}>
              <div className="profile__password-inputs">
                <Input
                  id="profile-current-password"
                  label="Current Password"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={event => this.setState({ oldPassword: event.target.value })}
                  type="password"
                />

                <Input
                  id="profile-new-password"
                  label="New Password"
                  name="newPassword"
                  value={newPassword}
                  onChange={event => this.setState({ newPassword: event.target.value })}
                  type="password"
                />

                <Input
                  id="profile-confirm-password"
                  label="New Password"
                  name="newPasswordConfirm"
                  value={newPasswordConfirm}
                  onChange={event => this.setState({ newPasswordConfirm: event.target.value })}
                  type="password"
                />
              </div>
              <p className="profile__validation">{passwordValidation}</p>
              <input
                className="button button-primary"
                type="submit"
                value="Reset"
              />
            </form>
          </div>
        </div>
      ) // End profile

    } else { // If not logged in
      return <h3 className="profile-page__not-logged-in">You need to be logged in to view this page.</h3>
    }
  }


  render() {

    return (
      <div className="profile-page">
        {this.renderProfilePage()}
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default connect(mapStateToProps, { setCurrentUser })(ProfilePage)
