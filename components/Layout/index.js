import React from 'react'
import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'
import NavMenu from './NavMenu'

const Layout = props => {
  return (
    <div className="app">

      <Head>
        <title>Derek Garnett</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700|Montserrat:200,300,400,500,600,700" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Raleway:400,500,600&display=swap" rel="stylesheet" />
        <script src="https://js.stripe.com/v3/"></script>
      </Head>

      <NavMenu
        logo='https://img.icons8.com/metro/1600/source-code.png'
      />

      <Header
        mainTitle="Derek Garnett"
        subTitle="Web Development and Design"
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
}

export default Layout
