import React, { useContext } from 'react'
import sanitizeHTML from 'sanitize-html'
import { usePosts, keysContext } from '@/context'
import { usePostFilter } from '@/hooks'
import Notification from './Notification'
import Header from './Header'
import Footer from './Footer'
import NavMenu from './NavMenu'
import PageHead from '../PageHead'
import { Tags } from '@/types'

const Layout: React.FC = (props) => {
  const { keys } = useContext(keysContext)
  const { posts } = usePosts()

  const settings = {
    maxPosts: 5,
    postTags: [
      Tags.sectionHeader,
      Tags.sectionFooter,
      Tags.siteDescription,
      Tags.copyright,
      Tags.favicon,
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
    favicon = '',
    descriptionContent = '',
    keywords = '',
    shareImage = ''

  filtered.posts.forEach((post) => {
    if (post.tags && post.tags.includes(Tags.sectionHeader)) {
      headerTitle = post.title || ''
      headerSubTitle = post.content || ''
      if (!logo) {
        logo = post.media || ''
      }
      if (!favicon) {
        favicon = post.media || ''
      }
      titleHeaderContent = ''

      if (post.content) {
        titleHeaderContent = ` | ${sanitizeHTML(post.content, {
          allowedTags: [],
        })}`
      }
      if (!shareImage) {
        shareImage = post.media || ''
      }
    } else if (post.tags.includes(Tags.sectionFooter)) {
      footerTitle = post.title
      footerContent = post.content || ''
    } else if (post.tags.includes(Tags.copyright)) {
      footerCopyrightContent = post.content || ''
    } else if (post.tags.includes(Tags.siteDescription)) {
      descriptionContent = sanitizeHTML(post.content || '', {
        allowedTags: [],
      })
      post.tags.forEach((tag) => {
        if (tag !== Tags.siteDescription) {
          keywords =
            keywords.length === 0 ? tag : `${keywords}, ${tag}`
        }
      })
      if (post.media) {
        shareImage = post.media
      }
    } else if (post.tags.includes(Tags.favicon)) {
      favicon = post.media
    }
  })

  const notifications = usePostFilter(posts, {
    postTags: [Tags.notification],
  })

  const renderNotifications = () => {
    return notifications.posts.map((post) => {
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
        <style>
          {typeof window !== 'undefined' ? FontAwesome.dom.css() : ''}
        </style>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta name="language" content="en-us" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href={favicon}
        />
        <link rel="apple-touch-icon" sizes="57x57" href={favicon} />
        <link rel="apple-touch-icon" sizes="180x180" href={favicon} />
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

      <Header mainTitle={headerTitle} subTitle={headerSubTitle} />

      <main>{props.children}</main>

      <Footer
        footerTitle={footerTitle}
        footerContent={footerContent}
        footerCopyrightContent={footerCopyrightContent}
      />
    </div>
  )
}

export default Layout
