import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setUsers } from '../../reduxStore'
import Modal from '../Modal'


class UserList extends Component { 

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


  render() {

    return (
      <Modal
        buttonClasses="button button-primary"
        buttonText={`View Users (${this.props.users.length})`}
      >
        <div className="users-section">

          <h3 className="heading-tertiary">Users</h3>

          <ul className="users-section__list">
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
