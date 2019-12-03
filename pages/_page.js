import React, { Fragment } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import { connect } from 'react-redux'
import axios from 'axios'
import {
  SectionStandard,
  SectionCards,
  SectionSlideshow,
  SectionMedia,
  SectionMaps,
  PostShow,
  ContactForm
} from '../components/Sections/'
import filterPosts from '../components/filterPosts'


const renderSections = props => {

  return props.page.sections.map((section, i) => {

    section = JSON.parse(section)

    const key = `${section.type}-${i}`
    const posts = props[key]
    const emptyMessage = `Create content with the ${section.tags} tags.`

    switch (section.type) {

      case 'Map':
        return <SectionMaps
          key={key}
          posts={posts}
          mapLocation="end"
          emptyTitle={section.title}
          emptyMessage={emptyMessage}
        />

      case 'Media':
        return <SectionMedia
          key={key}
          post={posts[0]}
          alt={section.title}
          emptyTitle={section.title}
          emptyMessage={emptyMessage}
        />

      case 'Parallax':
        return <SectionMedia
          key={key}
          post={posts[0]}
          alt={section.title}
          emptyTitle={section.title}
          emptyMessage={emptyMessage}
          fixed
        />

      case 'Slideshow':
        return <SectionSlideshow
          key={key}
          posts={posts}
          timer={5000}
          emptyTitle={section.title}
          emptyMessage={emptyMessage}
        />

      case 'ThreeCards':
        return <SectionCards
          key={key}
          posts={posts}
          title={section.title}
          contentLength={120}
          readMore
          perRow={3}
          emptyMessage={emptyMessage}
        />

      case 'FourCards':
        return <SectionCards
          key={key}
          posts={posts}
          title={section.title}
          contentLength={120}
          readMore
          perRow={4}
          emptyMessage={emptyMessage}
        />

      case 'Standard':
        return <SectionStandard
          key={key}
          readMore
          contentLength={300}
          posts={posts}
          title={section.title}
          className={section.className}
          emptyMessage={emptyMessage}
        />

      case 'LeftStandard':
        return <SectionStandard
          key={key}
          readMore
          mediaLeft
          contentLength={300}
          posts={posts}
          title={section.title}
          className={section.className}
          emptyMessage={emptyMessage}
        />

      case 'RightStandard':
        return <SectionStandard
          key={key}
          readMore
          mediaRight
          contentLength={300}
          posts={posts}
          title={section.title}
          className={section.className}
          emptyMessage={emptyMessage}
        />

      case 'ContactForm':
        return <ContactForm
          className={section.className}
          key={key}
        />

      default:
        return <PostShow
          key={key}
          post={posts[0]}
          path="posts"
          className={section.className}
          apiPath="/api/posts"
          redirectRoute="/posts"
        />
    }
  })
}


const PageContent = props => (
  <Fragment>
    <Head>
      <style>{props.page.css}</style>
    </Head>
    <div className={`${props.page.className} page`}>
      {renderSections(props)}
    </div>
  </Fragment>
)


const Page = props => {

  const settings = []
  const page = props.previewPage ? props.previewPage : props.page

  for (let i = 0; i < page.sections.length; i++) {

    const section = JSON.parse(page.sections[i])

    settings.push({
      propName: `${section.type}-${i}`,
      maxPosts: section.maxPosts,
      postTags: section.tags,
      strictTags: true
    })
  }

  const PageComponent = filterPosts(PageContent, settings)
  return <PageComponent page={page} />
}


Page.getInitialProps = async ({ req, query }) => {

  let page
  let googleMapsKey

  if (!!req) {
    page = query.pageObject
    googleMapsKey = query.googleMapsKey
  } else {
    try {
      const pageRes = await axios.get(`/api/page/${query.page}`)
      page = pageRes.data

      const mapsRes = await axios.post('/api/googleMapsKey')
      googleMapsKey = mapsRes.data

      // If we did not find a page, push to the page template file
    } catch(e) {
      Router.push(`/${query.page === 'home' ? '' : query.page}`)
    }
  }

  return { page, googleMapsKey }
}


const mapStateToProps = state => {
  return { page: state.page }
}


export default connect(mapStateToProps)(Page)
