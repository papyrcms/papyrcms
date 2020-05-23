import React, { Fragment, useContext } from 'react'
import axios from 'axios'
import _ from 'lodash'
import postsContext from '../context/postsContext'
import PageHead from '../components/PageHead'
import filterPosts from '../hooks/filterPosts'
import keys from '../config/keys'


const Page = (props) => {

  const settings = []
  const page = props.previewPage ? props.previewPage : props.page
  
  if (!page) return null

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

  const { sectionOptions } = props

  const renderSections = () => {

    return _.map(page.sections, (section, i) => {

      section = JSON.parse(section)

      const key = `${section.type}-${i}`
      const filteredPosts = filtered[key]
      const emptyMessage = `Create content with the ${_.join(section.tags, ', ')} tags.`

      const options = sectionOptions[section.type]
      const Component = require(`../components/Sections/${options.file}`).default

      return (
        <Component
          key={key}
          title={section.title}
          className={section.className || ''}
          post={filteredPosts[0]}
          posts={filteredPosts}
          emptyTitle={section.title || ''}
          emptyMessage={emptyMessage || ''}
          alt={section.title || ''}
          {...options.defaultProps}
        />
      )
    })
  }


  const renderPageHead = () => {

    let SectionStandard = false
    for (let section of page.sections) {
      section = JSON.parse(section)
      if (section.type === 'SectionStandard') {
        SectionStandard = true
      }
    }

    let title
    const headerSettings = {
      maxPosts: 1,
      postTags: ['section-header']
    }
    const { posts: [headerPost] } = filterPosts(posts, headerSettings)
    if (!SectionStandard && page.route !== 'home' && page.title && headerPost) {
      title = `${headerPost.title} | ${page.title}`
    }

    return (
      <PageHead title={title} keywords={title}>
        <style>{page.css}</style>
      </PageHead>
    )
  }

  return (
    <Fragment>
      {renderPageHead()}
      <div className={page.className}>
        {renderSections()}
      </div>
    </Fragment>
  )
}


Page.getInitialProps = async ({ query }) => {

  if (!query.page) {
    query.page = 'home'
  }

  try {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const { data: page } = await axios.get(`${rootUrl}/api/pages/${query.page}`)
    const { data: sectionOptions } = await axios.get(`${rootUrl}/api/pages/sectionOptions`)

    return { page, sectionOptions }
  } catch {
    return {}
  }
}


export default Page
