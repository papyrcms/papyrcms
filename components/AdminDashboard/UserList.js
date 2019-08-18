import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { setUsers } from '../../reduxStore'
import Modal from '../Modal'


class UserList extends Component {

  constructor(props) {
    super(props)

    this.state = { selectedUser: '' }
  }


  renderUserInfo(user) {

    const visible = user._id === this.state.selectedUser ? true : false

    return (
      <ul className={`user-list__info${visible ? ' user-list__info--visible' : ''}`}>
        <li>Email: {user.email}</li>
        <li>First Name: {user.firstName}</li>
        <li>Last Name: {user.lastName}</li>
        <li>Admin: {user.isAdmin.toString()}</li>
      </ul>
    )
  }


  renderUsers() {

    const { users } = this.props

    return users.map(user => {

      return (
        <li key={user._id} className="user-list__user">
          <div className="user-list__item">
            <span className="user-list__email">{user.email}</span>
            <button
              onClick={() => this.setState({ selectedUser: user._id })}
              className="user-list__check-info button button-small button-secondary"
            >
              Info
            </button>
          </div>
          {this.renderUserInfo(user)}
        </li>
      )
    })
  }


  render() {

    return (
      <Modal
        buttonClasses="button button-primary"
        buttonText={`View Users (${this.props.users.length})`}
      >
        <div className="user-list">

          <h3 className="heading-tertiary">Users</h3>

          <ul className="user-list__list">
            {this.renderUsers()}
          </ul>

        </div>
      </Modal>
    )
  }
}


const mapStateToProps = state => {
  return { users: state.users }
}


export default connect(mapStateToProps, { setUsers })(UserList)
