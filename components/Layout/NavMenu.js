import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'


const onClick = () => {
  const checkbox = document.getElementById('nav-menu-checkbox')

  checkbox.classList.toggle('checked')
}


const NavLink = props => {

  const href = props.href === '/'
    ? `/_page?page=home`
    : `/_page?page=${props.href.substr(1)}`

  return (
    <Link href={href} as={props.href}>
      <a className="nav-menu__item" title={props.title || props.children}>
        <li onClick={onClick}>
          {props.children}
        </li>
      </a>
    </Link>
  )
}


/**
 * NavMenu displayed at the top of every view.
 *
 * @prop logo - String - The source for the logo image displayed at the top right
 */
const NavMenu = props => {

  const { settings, pages } = props
  const { enableBlog, enableEvents, enableStore } = settings


  const renderBlogItem = () => {
    if (enableBlog) {
      return <NavLink href="/blog">Blog</NavLink>
    }
  }


  const renderEventsItem = () => {
    if (enableEvents) {
      return <NavLink href="/events">Events</NavLink>
    }
  }


  const renderStoreItem = () => {
    if (enableStore) {
      return <NavLink href="/store">Store</NavLink>
    }
  }


  const renderFirstMenuItems = () => {

    const navPages = pages.filter(page => {
      return (
        page.navOrder &&
        page.navOrder !== 0 &&
        page.navOrder <= 5 &&
        page.title
      )
    }).sort((a, b) => a.navOrder > b.navOrder ? 1 : -1)

    return navPages.map(page => {
      const href = page.route === 'home' ? '/' : `/${page.route}`
      return <NavLink href={href} key={page._id}>{page.title}</NavLink>
    })
  }


  const renderLastMenuItems = () => {

    const navPages = pages.filter(page => {
      return (
        page.navOrder &&
        page.navOrder > 5 &&
        page.title
      )
    }).sort((a, b) => a.navOrder > b.navOrder ? 1 : -1)

    return navPages.map(page => {
      const href = page.route === 'home' ? '/' : `/${page.route}`
      return <NavLink href={href} key={page._id}>{page.title}</NavLink>
    })
  }


  return (
    <nav>
      <ul className="nav-menu">

        <Link href="/">
          <a title="Home">
            <div className="nav-menu__logo">
              <img src={props.logo} alt="site logo" />
            </div>
          </a>
        </Link>

        <div className="nav-menu__items" id="nav-menu-checkbox">

          <span
            onClick={onClick}
            className="nav-menu__item nav-menu__item--hamburger"
          />

          {renderFirstMenuItems()}
          {renderBlogItem()}
          {renderEventsItem()}
          {renderStoreItem()}
          {renderLastMenuItems()}

        </div>

      </ul>
    </nav>
  )
}


const mapStateToProps = state => {
  return {
    settings: state.settings,
    pages: state.pages
  }
}


export default connect(mapStateToProps)(NavMenu)
