import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'
import { setCurrentUser } from '../reduxStore'
import Input from '../components/Input'
import useForm from '../hooks/useForm'

const ProfilePage = props => {

  const { currentUser, setCurrentUser } = props
  if (!currentUser) {
    return <h3 className="not-logged-in">You need to be logged in to view this page.</h3>
  }


  const info = useForm({ firstName: currentUser.firstName, lastName: currentUser.lastName, validation: '', userId: currentUser._id })
  const password = useForm({ oldPass: '', newPass: '', confirmPass: '', validation: '', userId: currentUser._id })


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

    const success = (response, setValidation) => {
      axios.get('/api/currentUser')
        .then(res => {
          setCurrentUser(res.data)
          setValidation('User info updated.')
        }).catch(err => {
          setValidation('Uh oh, something went wrong!')
          console.error(err)
        })
    }

    info.submitForm(event, '/api/currentUser', { success }, true)
  }


  const handlePasswordSubmit = event => {

    const success = (response, setValidation) => {
      setValidation('Your password has been changed.')
    }

    password.submitForm(event, '/api/changePassword', { success })
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
              value={info.values.firstName}
              validation={info.errors.firstName}
              onChange={info.handleChange}
              onBlur={info.validateField}
              required
            />

            <Input
              id="profile-last-name"
              label="Last Name"
              name="lastName"
              value={info.values.lastName}
              validation={info.errors.lastName}
              onChange={info.handleChange}
              onBlur={info.validateField}
              required
            />
          </div>

          <p className="profile__validation">{info.values.validation}</p>
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
              name="oldPass"
              value={password.values.oldPass}
              validation={password.errors.oldPass}
              onChange={password.handleChange}
              onBlur={password.validateField}
              type="password"
              required
            />

            <Input
              id="profile-new-password"
              label="New Password"
              name="newPass"
              value={password.values.newPass}
              validation={password.errors.newPass}
              onChange={password.handleChange}
              onBlur={password.validateField}
              type="password"
              required
            />

            <Input
              id="profile-confirm-password"
              label="Confirm Password"
              name="confirmPass"
              value={password.values.confirmPass}
              validation={password.errors.confirmPass}
              onChange={password.handleChange}
              onBlur={password.validateField}
              type="password"
              required
            />
          </div>
          <p className="profile__validation">{password.values.validation}</p>
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


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default connect(mapStateToProps, { setCurrentUser })(ProfilePage)
