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


const PageLayout = props => {

  let header,
      titleHeaderContent,
      footer,
      descriptionContent,
      keywords = ''

  props.posts.forEach(post => {

    if (post.tags.includes('section-header')) {

      header = post
      titleHeaderContent = header.content
        .replace('<p>', '')
        .replace('</p>', '')

    } else if (post.tags.includes('section-footer')) {

      footer = post

    } else if (post.tags.includes('site-description')) {

      descriptionContent = post.content
        .replace('<p>', '')
        .replace('</p>', '')
      post.tags.forEach(tag => {
        if (tag !== 'site-description') {
          keywords = keywords.length === 0 ? tag : `${keywords}, ${tag}`
        }
      })
    }
  })
  

  return (
    <div className="app">

      <Head>
        <title>{header.title} | {titleHeaderContent}</title>
        <meta name="title" content={`${header.title} | ${titleHeaderContent}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta property="og:image" content={header ? header.mainMedia : ''} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="200" />
        <meta property="og:image:height" content="200" />
        <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700|Montserrat:200,300,400,500,600,700" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Raleway:400,500,600&display=swap" rel="stylesheet" />
        <script src="https://js.stripe.com/v3/"></script>
        <meta name="keywords" content={keywords} />
        <meta name="description" content={descriptionContent} />
      </Head>

      <NavMenu
        logo={header ? header.mainMedia : ''}
      />

      <Header
        mainTitle={header ? header.title : ''}
        subTitle={header ? renderHTML(header.content) : ''}
      />

      <main>
        {props.children}
      </main>

      <Footer
        ctaText={footer ? footer.title : ''}
        ctaButtonText="contact"
        footerContent={footer ? renderHTML(footer.content) : ''}
      />

    </div>
  )
}


const Layout = props => (
  <PostsFilter
    component={PageLayout}
    posts={props.posts}
    settings={{
      maxPosts: 3, postTags: [
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
