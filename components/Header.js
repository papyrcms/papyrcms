import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import { setCurrentUser } from '../store'

class Header extends Component {

  renderAdminItems() {

    const { currentUser } = this.props

    if ( !!currentUser && currentUser.isAdmin ) {
      return (
        <span>
          <Link href="/posts_create" as="/posts/new">
            <a className="header__menu-item header__menu-item--2"><li>Add Post</li></a>
          </Link>

          <Link href="/posts_all" as="/posts">
            <a className="header__menu-item header__menu-item--3"><li>My Posts</li></a>
          </Link>
        </span>
      )
    }
  }


  renderAuthenticator() {

    if ( !!this.props.currentUser ) {
      return (
        <span>
          <Link href="/profile">
            <a className="header__menu-item header__menu-item--4"><li>Profile</li></a>
          </Link>
        </span>
      )
    }

    return (
      <Link href="/login">
        <a className="header__menu-item header__menu-item--2"><li>Login</li></a>
      </Link>
    )
  }


  renderNav() {

    const { settings, currentUser } = this.props;

    if ( settings.enableMenu || ( currentUser && currentUser.isAdmin ) ) {
      return (
        <ul className="header__menu">
          { this.renderAdminItems() }
          { this.renderAuthenticator() }
        </ul>
      )
    }
  }


  render() {
    
    const { mainTitle, subTitle } = this.props;

    return (
      <header className="header">
        <h1 className="heading-primary">
          <span className="heading-primary--main">{ mainTitle }</span>
          <span className="heading-primary--sub">{ subTitle }</span>
        </h1>
        { this.renderNav() }
      </header>
    )
  }
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser, settings: state.settings }
}


export default connect( mapStateToProps, { setCurrentUser })( Header )
