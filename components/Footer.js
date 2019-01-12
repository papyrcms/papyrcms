import React from 'react';
import Link from 'next/link';

const Footer = props => {
  return (
    <footer className='footer'>

      <div className="cta">
        <h2 className="cta__title u-margin-bottom-small">{ props.ctaText }</h2>
        <Link href="/contact">
          <button className="button button-primary">{ props.ctaButtonText }</button>
        </Link>
      </div>

      <div className="credit">
        <p className="credit__text">
          Website created by 
          <a className="credit__link" href="https://derekgarnett.com"> Derek Garnett </a>
          &copy; 2019
        </p>
      </div>

    </footer>
  );
}

export default Footer;
