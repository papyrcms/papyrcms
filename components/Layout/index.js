/**
 * Layout wrapping all views
 * 
 * props include:
 *   children: Component - The page rendered
 */

import React from 'react'
import Head from 'next/head'
import { connect } from 'react-redux'
import renderHTML from 'react-render-html'
import Header from './Header'
import Footer from './Footer'
import NavMenu from './NavMenu'
import PostsFilter from '../PostsFilter'
import sanitizeHTML from 'sanitize-html'


const PageLayout = props => {

  let headerTitle = '',
    headerSubTitle = '',
    titleHeaderContent = '',
    footerTitle = '',
    footerContent = '',
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
        <meta name="title" content={`${headerTitle}${titleHeaderContent}`} />
        <meta property="og:title" content={`${headerTitle}${titleHeaderContent}`} />
        <meta property="og:site_name" content={headerTitle} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta property="og:image" content={shareImage} />
        <meta property="og:url" content={shareImage} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="200" />
        <meta property="og:image:height" content="200" />
        <meta property="twitter:title" content={headerTitle} />
        <meta property="twitter:description" content={descriptionContent} />
        <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700|Montserrat:200,300,400,500,600,700" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Raleway:400,500,600&display=swap" rel="stylesheet" />
        <script src="https://js.stripe.com/v3/"></script>
        <meta name="keywords" content={keywords} />
        <meta name="description" content={descriptionContent} />
        <meta property="og:description" content={descriptionContent} />
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
        ctaText={footerTitle}
        ctaButtonText="contact"
        footerContent={renderHTML(footerContent)}
      />

    </div>
  )
}


const Layout = props => (
  <PostsFilter
    component={PageLayout}
    posts={props.posts}
    settings={{
      maxPosts: 3, 
      postTags: [
        'section-header',
        'section-footer',
        'site-description'
      ]
    }}
    componentProps={{
      children: props.children
    }}
  />
)


const mapStateToProps = state => {
  return { posts: state.posts }
}


export default connect(mapStateToProps)(Layout)
