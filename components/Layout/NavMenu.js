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
    <a className="nav-menu__item">
      <li onClick={onClick}>
        {props.children}
      </li>
    </a>
  </Link>
)


class NavMenu extends Component {

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
            <a>
              <div className="nav-menu__logo">
                <img src={this.props.logo} />
              </div>
            </a>
          </Link>

          <div className="nav-menu__items">

            <label
              onClick={onClick}
              id="nav-menu-checkbox"
              className="nav-menu__item nav-menu__item--hamburger"
            />

            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/services">Services</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/blog">Blog</NavLink>

            {this.renderEventsItem()}
            {this.renderStoreItem()}
            {this.renderDonateItem()}
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
