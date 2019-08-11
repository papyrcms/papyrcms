/**
 * NavMenu displayed at the top of every view.
 * 
 * props include:
 *   logo: String - The source for the logo image displayed at the top right
 */

import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'


const onClick = () => {
  const checkbox = document.getElementById('nav-menu-checkbox')

  checkbox.classList.toggle('checked')
}


const NavLink = props => (
  <Link href={props.href}>
    <a className="nav-menu__item" title={props.title || props.children}>
      <li onClick={onClick}>
        {props.children}
      </li>
    </a>
  </Link>
)


class NavMenu extends Component {

  renderBlogItem() {

    const { settings } = this.props

    if (!!settings && settings.enableBlog) {

      return <NavLink href="/blog">Blog</NavLink>
    }  
  }


  renderEventsItem() {

    const { settings } = this.props

    if (!!settings && settings.enableEvents) {

      return <NavLink href="/events">Events</NavLink>
    }
  }


  renderStoreItem() {

    const { settings } = this.props

    if (!!settings && settings.enableStore) {
      return <NavLink href="/store">Store</NavLink>
    }
  }


  renderDonateItem() {

    const { settings } = this.props

    if (!!settings && settings.enableDonations) {
      return <NavLink href="/donate">Donate</NavLink>
    }
  }


  render() {

    return (
      <nav>
        <ul className="nav-menu">

          <Link href="/">
            <a title="Home">
              <div className="nav-menu__logo">
                <img src={this.props.logo} alt="site logo" />
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

            {this.renderBlogItem()}
            {this.renderEventsItem()}
            {this.renderStoreItem()}
            {this.renderDonateItem()}

            <NavLink href="/contact">Contact</NavLink>
          </div>

        </ul>
      </nav>
    )
  }
}


const mapStateToProps = state => {
  return { settings: state.settings }
}


export default connect(mapStateToProps)(NavMenu)
