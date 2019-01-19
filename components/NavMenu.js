import React from 'react'
import Link from 'next/link'

const NavMenu = props => {
  return (
    <nav>
      <ul className="nav-menu">

        <Link href="/">
          <div className="nav-menu__logo">
            <img src={props.logo} />
          </div>
        </Link>

        <div className="nav-menu__items">
        
          <Link href="/">
            <li className="nav-menu__item">
              <a>Home</a>
            </li>
          </Link>

          <Link href="/about">
            <li className="nav-menu__item">
              <a>About</a>
            </li>
          </Link>

          <Link href="/services">
            <li className="nav-menu__item">
              <a>Services</a>
            </li>
          </Link>

          <Link href="/contact">
            <li className="nav-menu__item">
              <a>Contact</a>
            </li>
          </Link>

          <Link href="/donate">
            <li className="nav-menu__item">
              <a>Donate</a>
            </li>
          </Link>

        </div>

      </ul>
    </nav>
  )
}

export default NavMenu