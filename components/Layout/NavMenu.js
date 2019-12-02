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


const renderBlogItem = settings => {

  if (!!settings && settings.enableBlog) {
    return <NavLink href="/blog">Blog</NavLink>
  }
}


const renderEventsItem = settings => {

  if (!!settings && settings.enableEvents) {
    return <NavLink href="/events">Events</NavLink>
  }
}


const renderStoreItem = settings => {

  if (!!settings && settings.enableStore) {
    return <NavLink href="/store">Store</NavLink>
  }
}


const renderDonateItem = settings => {

  if (!!settings && settings.enableDonations) {
    return <NavLink href="/donate">Donate</NavLink>
  }
}


/**
 * NavMenu displayed at the top of every view.
 *
 * @prop logo - String - The source for the logo image displayed at the top right
 */
const NavMenu = props => (
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

        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/services">Services</NavLink>

        {renderBlogItem(props.settings)}
        {renderEventsItem(props.settings)}
        {renderStoreItem(props.settings)}
        {renderDonateItem(props.settings)}

        <NavLink href="/contact">Contact</NavLink>
      </div>

    </ul>
  </nav>
)


const mapStateToProps = state => {
  return { settings: state.settings }
}


export default connect(mapStateToProps)(NavMenu)
