import React, { useState, useContext } from 'react'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'
import userContext from '@/context/userContext'
import Input from '@/components/Input'
import useForm from '@/hooks/useForm'
import UserInfoForm from '@/components/UserInfoForm'


const ProfilePage = () => {

  const [infoValidation, setInfoValidation] = useState('')
  const password = useForm({ oldPass: '', newPass: '', confirmPass: '', validation: '' })
  const { currentUser, setCurrentUser } = useContext(userContext)


  if (!currentUser) return null


  const onLogoutClick = () => {
    Router.push('/')
    localStorage.removeItem('token')
    setCurrentUser(null)
  }


  const handlePasswordSubmit = (event) => {
    event.preventDefault()

    const success = (response, setValidation) => {
      setValidation(response.data.message)
    }

    password.submitForm('/api/auth/changePassword', { success })
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

      <div>
        <UserInfoForm
          onSubmitSuccess={() => setInfoValidation('User info has been updated.')}
          onSubmitError={(formState, err) => setInfoValidation(err.response.data.message)}
        />
        <p className="profile__validation">{infoValidation}</p>
      </div>

      <div className="profile__password">
        <h3>Reset Password</h3>
        <form className="profile__form" onSubmit={handlePasswordSubmit}>
          <div className="u-form-row">
            <Input
              label="Current Password"
              name="oldPass"
              formState={password}
              type="password"
              required
            />

            <Input
              label="New Password"
              name="newPass"
              formState={password}
              type="password"
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPass"
              formState={password}
              type="password"
              required
            />
          </div>
          <input
            className="button button-primary"
            type="submit"
            value="Reset"
          />
          <p className="profile__validation">{password.values.validation}</p>
        </form>
      </div>
    </div>
  )
}


export default ProfilePage
