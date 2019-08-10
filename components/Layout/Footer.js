/**
 * Footer for every view except those listed in excludeFooterRoutes
 * 
 * props include:
 *   ctaText: String - Heading text over the CTA button
 *   ctaButtonText: String - Text inside the CTA button
 */

import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'

const excludeFooterRoutes = [
  '/admin',
  '/posts_create',
  '/posts_all',
  '/blog_create',
  '/contact'
]

const Footer = props => {

  // Only include the footer if the current route is not in the array
  if (!excludeFooterRoutes.includes(props.route)) {
    return (
      <footer className='footer'>

        {/* Footer contact form */}
        <div className="cta">
          <h2 className="cta__title u-margin-bottom-small">{props.footerTitle}</h2>
          <div className="cta__content">{props.footerContent}</div>
          <Link href="/contact">
            <button className="button button-cta">{props.ctaButtonText}</button>
          </Link>
        </div>

        {/* Credit section */}
        <div className="credit">
          <div className="credit__text">
            {props.footerCopyrightContent}
          </div>
        </div>

      </footer>
    )
  } else {
    return null
  }
}


const mapStateToProps = state => {
  return { route: state.route }
}


export default connect(mapStateToProps)(Footer)
