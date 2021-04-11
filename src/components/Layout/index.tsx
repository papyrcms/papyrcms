import React, { useContext } from 'react'
import sanitizeHTML from 'sanitize-html'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import { postsContext, keysContext } from '@/context'
import { usePostFilter } from '@/hooks'
import Notification from './Notification'
import Header from './Header'
import Footer from './Footer'
import NavMenu from './NavMenu'
import PageHead from '../PageHead'

const Layout: React.FC = (props) => {
  const { keys } = useContext(keysContext)
  const { posts } = useContext(postsContext)

  const settings = {
    maxPosts: 4,
    postTags: [
      'section-header',
      'section-footer',
      'site-description',
      'copyright',
    ],
  }
  const filtered = usePostFilter(posts, settings)

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

  _.forEach(filtered.posts, (post) => {
    if (post.tags && post.tags.includes('section-header')) {
      headerTitle = post.title || ''
      headerSubTitle = post.content || ''
      logo = post.mainMedia || ''
      titleHeaderContent = ''

      if (post.content) {
        titleHeaderContent = ` | ${sanitizeHTML(post.content, {
          allowedTags: [],
        })}`
      }
      if (!shareImage) {
        shareImage = post.mainMedia || ''
      }
    } else if (post.tags.includes('section-footer')) {
      footerTitle = post.title
      footerContent = post.content || ''
    } else if (post.tags.includes('copyright')) {
      footerCopyrightContent = post.content || ''
    } else if (post.tags.includes('site-description')) {
      descriptionContent = sanitizeHTML(post.content || '', {
        allowedTags: [],
      })
      _.forEach(post.tags, (tag) => {
        if (tag !== 'site-description') {
          keywords =
            keywords.length === 0 ? tag : `${keywords}, ${tag}`
        }
      })
      if (post.mainMedia) {
        shareImage = post.mainMedia
      }
    }
  })

  const notifications = usePostFilter(posts, {
    postTags: ['notification'],
  })

  const renderNotifications = () => {
    return _.map(notifications.posts, (post) => {
      return <Notification key={post.id} post={post} />
    })
  }

  return (
    <div className="papyr-app">
      <PageHead
        title={headerTitle}
        titleContent={titleHeaderContent}
        image={shareImage}
        description={descriptionContent}
        keywords={keywords}
      >
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta name="language" content="en-us" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="shortcut icon" type="image/x-icon" href={logo} />
        <link rel="apple-touch-icon" sizes="57x57" href={logo} />
        <link rel="apple-touch-icon" sizes="180x180" href={logo} />
        <link
          href="https://fonts.googleapis.com/css?family=Lato:300,400,700|Montserrat:200,300,400,500,600,700"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Raleway:400,500,600&display=swap"
          rel="stylesheet"
        />
        <script src="https://js.stripe.com/v3/"></script>
        <script
          src={`https://cdn.tiny.cloud/1/${keys.tinyMceKey}/tinymce/5/tinymce.min.js`}
          referrerPolicy="origin"
        ></script>
      </PageHead>

      {renderNotifications()}

      <NavMenu logo={logo} />

      <Header
        mainTitle={headerTitle}
        subTitle={renderHTML(headerSubTitle)}
      />

      <main>{props.children}</main>

      <Footer
        footerTitle={footerTitle}
        footerContent={renderHTML(footerContent)}
        footerCopyrightContent={renderHTML(footerCopyrightContent)}
      />
    </div>
  )
}

export default Layout
