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


/**
 * Footer for every view except those listed in excludeFooterRoutes
 * 
 * @prop ctaText - String - Heading text over the CTA button
 * @prop ctaButtonText - String - Text inside the CTA button
 */
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
            <a title="Contact">
              <button className="button button-cta">{props.ctaButtonText}</button>
            </a>
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
