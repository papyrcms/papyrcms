import React, { Fragment, useContext } from 'react'
import axios from 'axios'
import {
  SectionStrip,
  SectionCards,
  SectionSlideshow,
  SectionMedia,
  SectionMaps,
  SectionStandard,
  ContactForm,
  DonateForm
} from '../components/Sections/'
import postsContext from '../context/postsContext'
import PageHead from '../components/PageHead'
import filterPosts from '../hooks/filterPosts'
import keys from '../config/keys'


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

  const { posts } = useContext(postsContext)
  const filtered = filterPosts(posts, settings)


  const renderSections = () => {

    return props.page.sections.map((section, i) => {

      section = JSON.parse(section)

      const key = `${section.type}-${i}`
      const posts = filtered[key]
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

        case 'Strip':
          return <SectionStrip
            key={key}
            readMore
            contentLength={300}
            posts={posts}
            title={section.title}
            className={section.className}
            emptyMessage={emptyMessage}
          />

        case 'LeftStrip':
          return <SectionStrip
            key={key}
            readMore
            mediaLeft
            contentLength={300}
            posts={posts}
            title={section.title}
            className={section.className}
            emptyMessage={emptyMessage}
          />

        case 'RightStrip':
          return <SectionStrip
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

        case 'DonateForm':
          return <DonateForm
            className={section.className}
            key={key}
          />

        default:
          return <SectionStandard
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


  const renderPageHead = () => {

    let SectionStandard = false
    for (let section of props.page.sections) {
      section = JSON.parse(section)
      if (section.type === 'SectionStandard') {
        SectionStandard = true
      }
    }

    let title
    if (!SectionStandard && props.page.route !== 'home') {
      title = `Derek Garnett | ${props.page.title}`
    }

    return (
      <PageHead title={title} keywords={title}>
        <style>{props.page.css}</style>
      </PageHead>
    )
  }

  return (
    <Fragment>
      {renderPageHead()}
      <div className={props.page.className}>
        {renderSections()}
      </div>
    </Fragment>
  )
}


Page.getInitialProps = async ({ query }) => {
  if (!query.page) {
    query.page = 'home'
  }

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const { data: page } = await axios.get(`${rootUrl}/api/pages/${query.page}`)

  return { page }
}


export default Page
