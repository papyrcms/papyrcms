import React from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import axios from 'axios'
import {
  SectionStandard,
  SectionCards,
  SectionSlideshow,
  SectionMedia,
  SectionMaps
} from '../components/Sections/'
import PostShow from '../components/PostShow/'
import filterPosts from '../components/filterPosts'


const renderSections = props => {

  return props.page.sections.map((section, i) => {

    section = JSON.parse(section)
    switch (section.type) {

      case 'Map':
        return <SectionMaps
          key={`${section.type}-${i}`}
          posts={props[`${section.type}-${i}`]}
          mapLocation="end"
          emptyTitle={section.title}
          emptyMessage={`Create content with the ${section.tags} tags.`}
        />

      case 'Media':
        return <SectionMedia
          key={`${section.type}-${i}`}
          post={props[`${section.type}-${i}`][0]}
          alt={section.title}
          emptyTitle={section.title}
          emptyMessage={`Create content with the ${section.tags} tags.`}
        />

      case 'Parallax':
        return <SectionMedia
          key={`${section.type}-${i}`}
          post={props[`${section.type}-${i}`][0]}
          alt={section.title}
          emptyTitle={section.title}
          emptyMessage={`Create content with the ${section.tags} tags.`}
          fixed
        />

      case 'Slideshow':
        return <SectionSlideshow
          key={`${section.type}-${i}`}
          posts={props[`${section.type}-${i}`]}
          timer={5000}
          emptyTitle={section.title}
          emptyMessage={`Create content with the ${section.tags} tags.`}
        />

      case 'ThreeCards':
        return <SectionCards
          key={`${section.type}-${i}`}
          posts={props[`${section.type}-${i}`]}
          title={section.title}
          contentLength={120}
          readMore
          perRow={3}
          emptyMessage={`Create content with the ${section.tags} tags.`}
        />

      case 'FourCards':
        return <SectionCards
          key={`${section.type}-${i}`}
          posts={props[`${section.type}-${i}`]}
          title={section.title}
          contentLength={120}
          readMore
          perRow={4}
          emptyMessage={`Create content with the ${section.tags} tags.`}
        />

      case 'Standard':
        return <SectionStandard
          key={`${section.type}-${i}`}
          readMore
          contentLength={300}
          posts={props[`${section.type}-${i}`]}
          title={section.title}
          className={section.className}
          emptyMessage={`Create content with the ${section.tags} tag.`}
        />

      case 'LeftStandard':
        return <SectionStandard
          key={`${section.type}-${i}`}
          readMore
          mediaLeft
          contentLength={300}
          posts={props[`${section.type}-${i}`]}
          title={section.title}
          className={section.className}
          emptyMessage={`Create content with the ${section.tags} tag.`}
        />

      case 'RightStandard':
        return <SectionStandard
          key={`${section.type}-${i}`}
          readMore
          mediaRight
          contentLength={300}
          posts={props[`${section.type}-${i}`]}
          title={section.title}
          className={section.className}
          emptyMessage={`Create content with the ${section.tags} tag.`}
        />

      default:
        return <PostShow
          key={`${section.type}-${i}`}
          post={props[`${section.type}-${i}`][0]}
          path="post"
          apiPath="/api/posts"
          redirectRoute="/post/all"
        />
    }
  })
}


const PageContent = props => (
  <div className={props.page.className}>
    {renderSections(props)}
  </div>
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
