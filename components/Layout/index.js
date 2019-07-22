/**
 * Layout wrapping all views
 * 
 * props include:
 *   children: Component - The page rendered
 */

import React from 'react'
import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'
import NavMenu from './NavMenu'

export default props => (
  <div className="app">

    <Head>
      <title>Derek Garnett | Development and Design</title>
      <meta name="title" content="Derek Garnett | Development and Design" />
      <meta name="keywords" content="web, mobile, dev, development, design, webdev" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700|Montserrat:200,300,400,500,600,700" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Raleway:400,500,600&display=swap" rel="stylesheet" />
      <script src="https://js.stripe.com/v3/"></script>
    </Head>

    <NavMenu
      logo="https://i.imgur.com/gPy1qHw.png"
    />

    <Header
      mainTitle="Derek Garnett"
      subTitle="Development and Design"
    />

    <main>
      {props.children}
    </main>

    <Footer
      ctaText="Get in touch"
      ctaButtonText="contact"
    />

  </div>
)
