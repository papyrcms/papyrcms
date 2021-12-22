import { useState, useContext } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { useUser } from '@/context'
import { Input, Button, UserInfoForm } from '@/components'
import { useForm } from '@/hooks'
import styles from './profile.module.scss'

const ProfilePage = () => {
  const [infoValidation, setInfoValidation] = useState('')
  const password = useForm({
    oldPass: '',
    newPass: '',
    confirmPass: '',
    validation: '',
  })
  const { currentUser, setCurrentUser } = useUser()

  if (!currentUser) {
    return (
      <h3 className={`heading-tertiary ${styles['profile__login']}`}>
        <Link href="/login">Login</Link> to view your profile.
      </h3>
    )
  }

  const onLogoutClick = async () => {
    Router.push('/')
    await axios.delete('/api/auth/logout')
    localStorage.removeItem('token')
    await setCurrentUser(null)
  }

  const handlePasswordSubmit = (
    event: any,
    resetButton: Function
  ) => {
    event.preventDefault()

    const success = (response: any, setValidation: Function) => {
      setValidation(response.data.message)
      resetButton()
    }

    const error = () => resetButton()

    password.submitForm('/api/auth/changePassword', {
      success,
      error,
    })
  }

  const renderAdmin = () => {
    if (currentUser.isAdmin) {
      return (
        <div>
          <p>You are an admin.</p>
          <Link href="/admin" as="/admin">
            <button className="button button-primary">
              Admin Dashboard
            </button>
          </Link>
        </div>
      )
    }
  }

  const onSubscribeClick = async (event: any, reset: Function) => {
    try {
      const response = await axios.put('/api/auth/currentUser', {
        isSubscribed: !currentUser.isSubscribed,
      })
      setCurrentUser(response.data)
    } catch (err: any) {
      console.error(err)
    }

    reset()
  }

  return (
    <div className={styles.main}>
      <h1 className="heading-secondary">Profile</h1>

      <div className={styles.credentials}>
        <div className={styles.logout}>
          <span>
            Not{' '}
            {!!currentUser.firstName
              ? currentUser.firstName
              : currentUser.email}
            ?
          </span>
          <Button onClick={onLogoutClick}>Log Out</Button>
        </div>

        <div className={styles.unsubscribe}>
          You are {currentUser.isSubscribed ? '' : 'not '}subscribed.
          <Button onClick={onSubscribeClick}>
            {currentUser.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          </Button>
        </div>

        {renderAdmin()}
      </div>

      <div>
        <UserInfoForm
          onSubmitSuccess={() =>
            setInfoValidation('User info has been updated.')
          }
          onSubmitError={(formState: any, err: any) =>
            setInfoValidation(err.response.data.message)
          }
        />
        <p className={styles.validation}>{infoValidation}</p>
      </div>

      <div className={styles.password}>
        <h3>Reset Password</h3>
        <form className={styles.form}>
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
          <Button onClick={handlePasswordSubmit}>Reset</Button>
          <p className={styles.validation}>
            {password.values.validation}
          </p>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
