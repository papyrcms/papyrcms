import { User } from '@/types'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { userContext } from '@/context'
import Modal from '../../Modal'
import styles from './UserList.module.scss'

const UserList = () => {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState('')
  const { currentUser } = useContext(userContext)

  useEffect(() => {
    const getUsers = async () => {
      if (currentUser?.isAdmin) {
        const { data: users } = await axios.get('/api/users')
        setUsers(users)
      }
    }
    getUsers()
  }, [currentUser])

  const deleteUser = (user: User) => {
    const confirm = window.confirm(
      `Are you sure you want to delete ${user.email}`
    )

    if (confirm && currentUser && user.id !== currentUser.id) {
      axios
        .delete(`/api/users/${user.id}`)
        .then((response) => {
          const newUsers = users.filter(
            (foundUser) => user.id !== foundUser.id
          )
          setUsers(newUsers)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const changeAdminStatus = (user: User) => {
    if (currentUser && user.id !== currentUser.id) {
      axios
        .put('/api/users/makeAdmin', {
          userId: user.id,
          isAdmin: !user.isAdmin,
        })
        .then((response) => {
          const newUsers = users.map((foundUser) => {
            if (user.id === foundUser.id) {
              foundUser.isAdmin = !user.isAdmin
            }
            return foundUser
          })
          setUsers(newUsers)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const changeBannedStatus = (user: User) => {
    if (currentUser && user.id !== currentUser.id) {
      axios
        .put('/api/users/ban', {
          userId: user.id,
          isBanned: !user.isBanned,
        })
        .then((response) => {
          const newUsers = users.map((foundUser) => {
            if (user.id === foundUser.id) {
              foundUser.isBanned = !user.isBanned
            }
            return foundUser
          })
          setUsers(newUsers)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const renderUserOptions = (user: User) => {
    if (currentUser && user.id !== currentUser.id) {
      return (
        <div className={styles.options}>
          <button
            className="button-edit button-small"
            onClick={() => changeAdminStatus(user)}
          >
            {user.isAdmin ? 'Revoke' : 'Make'} Admin
          </button>

          <button
            className="button-delete button-small"
            onClick={() => changeBannedStatus(user)}
          >
            {user.isBanned ? 'Unban' : 'Ban'}
          </button>

          <button
            className="button-delete button-small"
            onClick={() => deleteUser(user)}
          >
            Delete
          </button>
        </div>
      )
    }
  }

  const renderUserInfo = (user: User) => {
    const visible = user.id === selectedUser ? true : false

    return (
      <div
        className={`${styles.info} ${visible ? styles.visible : ''}`}
      >
        <ul className={styles.details}>
          <li>First Name: {user.firstName}</li>
          <li>Last Name: {user.lastName}</li>
          <li>Subscribed: {(!!user.isSubscribed).toString()}</li>
          <li>Admin: {(!!user.isAdmin).toString()}</li>
          <li>Banned: {(!!user.isBanned).toString()}</li>
        </ul>

        {renderUserOptions(user)}
      </div>
    )
  }

  const renderUsers = () => {
    return users.map((user) => {
      return (
        <li key={user.id} className={styles.user}>
          <div className={styles.item}>
            <span className={styles.email}>{user.email}</span>
            <button
              onClick={() => setSelectedUser(user.id)}
              className="button-secondary button-small"
            >
              Info
            </button>
          </div>
          {renderUserInfo(user)}
        </li>
      )
    })
  }

  return (
    <Modal
      buttonClasses="button-primary"
      buttonText={`View Users (${users.length})`}
    >
      <div>
        <h3 className="heading-tertiary">Users</h3>

        <ul className={styles.list}>{renderUsers()}</ul>
      </div>
    </Modal>
  )
}

export default UserList
