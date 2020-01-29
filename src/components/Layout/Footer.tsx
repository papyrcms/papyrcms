import React from 'react'
import { connect } from 'react-redux'

const excludeFooterRoutes = [
  '/admin',
  '/posts/create',
  '/posts',
  '/blog/create',
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
  if (excludeFooterRoutes.includes(props.route)) {
    return null
  }

  return (
    <footer className='footer'>

      {/* Footer contact form */}
      <div className="cta">
        <h2 className="cta__title u-margin-bottom-small">{props.footerTitle}</h2>
        <div className="cta__content">{props.footerContent}</div>
      </div>

      {/* Credit section */}
      <div className="credit">
        <div className="credit__text">
          {props.footerCopyrightContent}
        </div>
      </div>

    </footer>
  )
}


const mapStateToProps = state => {
  return { route: state.route }
}


export default connect(mapStateToProps)(Footer)
