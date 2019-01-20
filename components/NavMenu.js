import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'

class NavMenu extends Component {

  renderDonateItem() {

    if ( this.props.settings.enableDonations ) {
      return (
        <Link href="/donate">
          <li className="nav-menu__item" onClick={() => this.onClick()}>
            <a>Donate</a>
          </li>
        </Link>
      )
    }
  }


  onClick() {

    const checkbox = document.getElementById('nav-menu-checkbox');

    checkbox.classList.toggle('checked')
  }


  render() {

    return (
      <nav>
        <ul className="nav-menu">

          <Link href="/">
            <div className="nav-menu__logo">
              <img src={this.props.logo} />
            </div>
          </Link>

          <div className="nav-menu__items">
          
            <label
              onClick={() => this.onClick()}
              id="nav-menu-checkbox" 
              className="nav-menu__item nav-menu__item--hamburger"
            ></label>

            <Link href="/">
              <li onClick={() => this.onClick()} className="nav-menu__item">
                <a>Home</a>
              </li>
            </Link>

            <Link href="/about">
              <li onClick={() => this.onClick()} className="nav-menu__item">
                <a>About</a>
              </li>
            </Link>

            <Link href="/services">
              <li onClick={() => this.onClick()} className="nav-menu__item">
                <a>Services</a>
              </li>
            </Link>

            <Link href="/contact">
              <li onClick={() => this.onClick()} className="nav-menu__item">
                <a>Contact</a>
              </li>
            </Link>

            { this.renderDonateItem() }
          </div>

        </ul>
      </nav>
    )
  }
}


const mapStateToProps = state => {
  return { settings: state.settings }
}


export default connect( mapStateToProps )( NavMenu )
