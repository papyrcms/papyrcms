import React from 'react'
import Head from 'next/head'
import sanitizeHTML from 'sanitize-html'
import renderHTML from 'react-render-html'
import Header from './Header'
import Footer from './Footer'
import NavMenu from './NavMenu'
import filterPosts from '../filterPosts'


/**
 * Layout wrapping all views
 *
 * @prop children - Component - The page rendered
 */
const Layout = props => {

  let headerTitle = '',
    headerSubTitle = '',
    titleHeaderContent = '',
    footerTitle = '',
    footerContent = '',
    footerCopyrightContent = '',
    logo = '',
    descriptionContent = '',
    keywords = '',
    shareImage = ''

  props.posts.forEach(post => {

    if (post.tags.includes('section-header')) {

      headerTitle = post.title || ''
      headerSubTitle = post.content || ''
      logo = post.mainMedia || ''
      titleHeaderContent = ''

      if (post.content) {
        titleHeaderContent = ` | ${sanitizeHTML(post.content, { allowedTags: [] })}`
      }
      if (!shareImage) {
        shareImage = post.mainMedia
      }

    } else if (post.tags.includes('section-footer')) {

      footerTitle = post.title
      footerContent = post.content

    } else if (post.tags.includes('copyright')) {

      footerCopyrightContent = post.content

    } else if (post.tags.includes('site-description')) {

      descriptionContent = sanitizeHTML(post.content, { allowedTags: [] })
      post.tags.forEach(tag => {
        if (tag !== 'site-description') {
          keywords = keywords.length === 0 ? tag : `${keywords}, ${tag}`
        }
      })
      if (post.mainMedia) {
        shareImage = post.mainMedia
      }
    }
  })


  return (
    <div className="app">

      <Head>
        <title>{headerTitle}{titleHeaderContent}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="shortcut icon" type="image/x-icon" href="/static/cup.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/static/cup.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/static/cup.png" />
        <meta key="title" name="title" content={`${headerTitle}${titleHeaderContent}`} />
        <meta key="og-title" property="og:title" content={`${headerTitle}${titleHeaderContent}`} />
        <meta key="og-site-name" property="og:site_name" content={headerTitle} />
        <meta key="og-image" property="og:image" content={shareImage} />
        <meta key="og-url" property="og:url" content={shareImage} />
        <meta key="og-image-type" property="og:image:type" content="image/jpeg" />
        <meta key="og-image-width" property="og:image:width" content="200" />
        <meta key="og-image-height" property="og:image:height" content="200" />
        <meta key="twitter-title" property="twitter:title" content={headerTitle} />
        <meta key="twitter-description" property="twitter:description" content={descriptionContent} />
        <meta key="keywords" name="keywords" content={keywords} />
        <meta key="description" name="description" content={descriptionContent} />
        <meta key="og-description" property="og:description" content={descriptionContent} />
        <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700|Montserrat:200,300,400,500,600,700" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Raleway:400,500,600&display=swap" rel="stylesheet" />
        <script src="https://js.stripe.com/v3/"></script>
        <script src="//tinymce.cachefly.net/4.2/tinymce.min.js"></script>
      </Head>

      <NavMenu
        logo={logo}
      />

      <Header
        mainTitle={headerTitle}
        subTitle={renderHTML(headerSubTitle)}
      />

      <main>
        {props.children}
      </main>

      <Footer
        footerTitle={footerTitle}
        footerContent={renderHTML(footerContent)}
        ctaButtonText="contact"
        footerCopyrightContent={renderHTML(footerCopyrightContent)}
      />

    </div>
  )
}


const settings = {
  maxPosts: 4,
  postTags: [
    'section-header',
    'section-footer',
    'site-description',
    'copyright'
  ]
}


export default filterPosts(Layout, settings)
