/**
 * NavMenu displayed at the top of every view.
 * 
 * props include:
 *   logo: String - The source for the logo image displayed at the top right
 */

import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'

class NavMenu extends Component {

  renderEventsItem() {

    const { settings } = this.props

    if (!!settings && settings.enableEvents) {

      return (
        <Link href="/events">
          <a className="nav-menu__item">
            <li onClick={() => this.onClick()}>
              Events
            </li>
          </a>
        </Link>
      )
    }
  }


  renderStoreItem() {

    const { settings } = this.props

    if (!!settings && settings.enableStore) {

      return (
        <Link href="/store">
          <a className="nav-menu__item">
            <li onClick={() => this.onClick()} className="nav-menu__item">
              Store
            </li>
          </a>
        </Link>
      )
    }
  }


  renderDonateItem() {

    const { settings } = this.props

    if (!!settings && settings.enableDonations) {
      return (
        <Link href="/donate">
          <a className="nav-menu__item">
            <li onClick={() => this.onClick()}>
              Donate
            </li>
          </a>
        </Link>
      )
    }
  }


  onClick() {

    const checkbox = document.getElementById('nav-menu-checkbox')

    checkbox.classList.toggle('checked')
  }


  render() {

    return (
      <nav>
        <ul className="nav-menu">

          <Link href="/"><a>
            <div className="nav-menu__logo">
              <img src={this.props.logo} />
            </div>
          </a></Link>

          <div className="nav-menu__items">

            <label
              onClick={() => this.onClick()}
              id="nav-menu-checkbox"
              className="nav-menu__item nav-menu__item--hamburger"
            ></label>

            <Link href="/">
              <a className="nav-menu__item">
                <li onClick={() => this.onClick()}>
                  Home
                </li>
              </a>
            </Link>

            <Link href="/about">
              <a className="nav-menu__item">
                <li onClick={() => this.onClick()}>
                  About
                </li>
              </a>
            </Link>

            <Link href="/services">
              <a className="nav-menu__item">
                <li onClick={() => this.onClick()}>
                  Services
                </li>
              </a>
            </Link>

            <Link href="/contact">
              <a className="nav-menu__item">
                <li onClick={() => this.onClick()}>
                  Contact
                </li>
              </a>
            </Link>

            <Link href="/blog">
              <a className="nav-menu__item">
                <li onClick={() => this.onClick()}>
                  Blog
                </li>
              </a>
            </Link>

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
