import React, { Fragment } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'


/**
 * Header displayed in every view
 *
 * @prop mainTitle - String - Text displayed in big letters
 * @prop subTitle - String - Smaller text displayed under the main Title
 */
const Header = props => {

  const { currentUser, settings, mainTitle, subTitle, page } = props

  const renderAuthenticator = () => {
    if (currentUser) {
      return (
        <Link href="/profile">
          <a title="Profile" className="header__menu-item header__menu-item--1"><li>Profile</li></a>
        </Link>
      )
    }

    return (
      <Link href="/login">
        <a title="Login" className="header__menu-item header__menu-item--1"><li>Login</li></a>
      </Link>
    )
  }


  const renderAdminItems = () => {
    if (currentUser && currentUser.isAdmin) {
      return (
        <Link href="/posts/new">
          <a title="Content" className="header__menu-item header__menu-item--2"><li>Add Content</li></a>
        </Link>
      )
    }
  }


  const renderNav = () => {
    if (
      (settings && settings.enableMenu) ||
      (currentUser && currentUser.isAdmin)
    ) {
      return (
        <ul className="header__menu">
          {renderAuthenticator()}
          {renderAdminItems()}
        </ul>
      )
    }
  }


  const renderTitle = () => {
    // if (page.title) {
    //   return <span className="heading-primary--main">{page.title}</span>
    // }

    return (
      <Fragment>
        <span className="heading-primary--main">{mainTitle}</span>
        <span className="heading-primary--sub">{subTitle}</span>
      </Fragment>
    )
  }


  return (
    <header className="header">
      <div className="header__container">
        <h1 className="heading-primary">
          {renderTitle()}
        </h1>
        {renderNav()}
      </div>
    </header>
  )
}


const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    settings: state.settings,
    page: state.page
  }
}


export default connect(mapStateToProps)(Header)
