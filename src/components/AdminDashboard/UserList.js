import React, { useState } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { setUsers } from '../../reduxStore'
import Modal from '../Modal'


const UserList = props => {


  const { currentUser, users, setUsers } = props
  const [selectedUser, setSelectedUser] = useState('')


  const deleteUser = user => {

    const confirm = window.confirm(`Are you sure you want to delete ${user.email}`)

    if (
      confirm &&
      user._id !== currentUser._id
    ) {

      axios.delete(`/api/users/${user._id}`)
        .then(response => {

          const newUsers = users.filter(foundUser => user._id !== foundUser._id)
          setUsers(newUsers)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }


  const changeAdminStatus = user => {

    if (user._id !== currentUser._id) {

      axios.put('/api/users/makeAdmin', { userId: user._id, isAdmin: !user.isAdmin })
        .then(response => {

          const newUsers = users.map(foundUser => {
            if (user._id === foundUser._id) {
              foundUser.isAdmin = !user.isAdmin
            }
            return foundUser
          })
          setUsers(newUsers)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }


  const changeBannedStatus = user => {

    if (user._id !== currentUser._id) {

      axios.put('/api/users/ban', { userId: user._id, isBanned: !user.isBanned })
        .then(response => {

          const newUsers = users.map(foundUser => {
            if (user._id === foundUser._id) {
              foundUser.isBanned = !user.isBanned
            }
            return foundUser
          })
          setUsers(newUsers)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }


  const renderUserOptions = user => {
    if (user._id !== currentUser._id) {
      return (
        <div className="user-list__options">
          <button
            className="button button-small button-edit"
            onClick={() => changeAdminStatus(user)}
          >
            {user.isAdmin ? 'Revoke' : 'Make'} Admin
          </button>

          <button
            className="button button-small button-delete"
            onClick={() => changeBannedStatus(user)}
          >
            {user.isBanned ? 'Unban' : 'Ban'}
          </button>

          <button
            className="button button-small button-delete"
            onClick={() => deleteUser(user)}
          >
            Delete
          </button>
        </div>
      )
    }
  }


  const renderUserInfo = user => {

    const visible = user._id === selectedUser ? true : false

    return (
      <div className={`user-list__info${visible ? ' user-list__info--visible' : ''}`}>
        <ul className="user-list__details">
          <li>First Name: {user.firstName}</li>
          <li>Last Name: {user.lastName}</li>
          <li>Subscribed: {user.isSubscribed.toString()}</li>
          <li>Admin: {user.isAdmin.toString()}</li>
          <li>Banned: {user.isBanned.toString()}</li>
        </ul>

        {renderUserOptions(user)}
      </div>
    )
  }


  const renderUsers = () => {
    return users.map(user => {
      return (
        <li key={user._id} className="user-list__user">
          <div className="user-list__item">
            <span className="user-list__email">{user.email}</span>
            <button
              onClick={() => setSelectedUser(user._id)}
              className="user-list__check-info button button-small button-secondary"
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
      buttonClasses="button button-primary"
      buttonText={`View Users (${users.length})`}
    >
      <div className="user-list">

        <h3 className="heading-tertiary">Users</h3>

        <ul className="user-list__list">
          {renderUsers()}
        </ul>

      </div>
    </Modal>
  )
}


const mapStateToProps = state => {
  return { users: state.users, currentUser: state.currentUser }
}


export default connect(mapStateToProps, { setUsers })(UserList)
