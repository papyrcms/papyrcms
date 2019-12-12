import React, { useState } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'
import { setCurrentUser } from '../reduxStore'
import Input from '../components/Input'

const ProfilePage = props => {

  const { currentUser, setCurrentUser } = props
  const [firstName, setFirstName] = useState(currentUser ? currentUser.firstName : '')
  const [lastName, setLastName] = useState(currentUser ? currentUser.lastName : '')
  const [infoValidation, setInfoValidation] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [passwordValidation, setPasswordValidation] = useState('')


  const onLogoutClick = () => {
    axios.get('/api/logout')
      .then(res => {
        if (res.data === 'logged out') {
          Router.push('/')
          setCurrentUser(null)
        }
      }).catch(err => {
        console.error(err)
      })
  }


  const handleInfoSubmit = event => {

    event.preventDefault()

    const infoData = { firstName, lastName, userId: currentUser._id }

    axios.put('/api/currentUser', infoData)
      .then(res => {
        if (!!res.data.error) {
          setInfoValidation(res.data.error)
        } else {
          axios.get('/api/currentUser')
            .then(res => {
              setCurrentUser(res.data)
              setInfoValidation('User info updated.')
            }).catch(err => {
              console.error(err)
            })
        }
      }).catch(err => {
        console.error(err)
      })
  }


  const handlePasswordSubmit = event => {

    event.preventDefault()

    const passwordData = { oldPassword, newPassword, newPasswordConfirm, userId: currentUser._id }

    axios.post('/api/changePassword', passwordData)
      .then(res => {
        setPasswordValidation(res.data.message)
        setOldPassword('')
        setNewPassword('')
        setNewPasswordConfirm('')
      }).catch(err => {
        console.error(err)
        setPasswordValidation(err.response.data.message)
      })
  }


  const renderAdmin = () => {
    if (currentUser.isAdmin) {
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


  const renderProfilePage = () => {

    if (!currentUser) {
      return <h3 className="profile-page__not-logged-in">You need to be logged in to view this page.</h3>
    }

    return (
      <div className="profile">
        <h1 className="heading-secondary">Profile</h1>

        <div className="profile__credentials">
          <div className="profile__logout">
            <span>Not {!!currentUser.firstName ? currentUser.firstName : currentUser.email}?</span>
            <button
              onClick={onLogoutClick}
              className="button button-primary"
            >
              Log Out
            </button>
          </div>
          {renderAdmin()}
        </div>

        <div className="profile__info">
          <p className="u-margin-bottom-small">Email: {currentUser.email}</p>

          {/* Personal Info Form */}
          <form className="profile__form" onSubmit={handleInfoSubmit}>

            <div className="profile__name-inputs">
              <Input
                id="profile-first-name"
                label="First Name"
                name="firstName"
                value={firstName}
                onChange={event => setFirstName(event.target.value)}
              />

              <Input
                id="profile-last-name"
                label="Last Name"
                name="lastName"
                value={lastName}
                onChange={event => setLastName(event.target.value)}
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
          <form className="profile__form" onSubmit={handlePasswordSubmit}>
            <div className="profile__password-inputs">
              <Input
                id="profile-current-password"
                label="Current Password"
                name="oldPassword"
                value={oldPassword}
                onChange={event => setOldPassword(event.target.value)}
                type="password"
              />

              <Input
                id="profile-new-password"
                label="New Password"
                name="newPassword"
                value={newPassword}
                onChange={event => setNewPassword(event.target.value)}
                type="password"
              />

              <Input
                id="profile-confirm-password"
                label="Confirm Password"
                name="newPasswordConfirm"
                value={newPasswordConfirm}
                onChange={event => setNewPasswordConfirm(event.target.value)}
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
    )
  }


  return (
    <div className="page profile-page">
      {renderProfilePage()}
    </div>
  )
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default connect(mapStateToProps, { setCurrentUser })(ProfilePage)
