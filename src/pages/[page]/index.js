import React, { useContext } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import axios from 'axios'
import _ from 'lodash'
import postsContext from '@/context/postsContext'
import pagesContext from '@/context/pagesContext'
import sectionOptionsContext from '@/context/sectionOptionsContext'
import PageHead from '@/components/PageHead'
import filterPosts from '@/hooks/filterPosts'
import keys from '@/keys'
import styles from './page.module.scss'


const Page = (props) => {

  // Determine if this is a page or the preview on the builder
  let page = props.previewPage ? props.previewPage : props.page
  
  // On a client load, we are not fetching the page from the server,
  // So we'll get it from the pages in our pages context
  const { query } = useRouter()
  const { pages } = useContext(pagesContext)
  if (!page) {
    _.forEach(pages, foundPage => {
      if (foundPage.route === 'home') foundPage.route === ''
      if (foundPage.route === query.page) page = foundPage
    })

    // If the page was still not found, don't return anything
    if (!page) return null
  }

  // Get our filter settings from the page sections
  const settings = []
  _.forEach(page.sections, (section, i) => {
    section = JSON.parse(section)

    settings.push({
      propName: `${section.type}-${i}`,
      maxPosts: section.maxPosts,
      postTags: section.tags,
      strictTags: true
    })
  })

  // Get posts and filter those by the settings
  const { posts } = useContext(postsContext)
  const filtered = filterPosts(posts, settings)

  // Get our section options
  const { sectionOptions } = useContext(sectionOptionsContext)

  const renderSections = () => {

    return _.map(page.sections, (section, i) => {

      // Parse the section from the page
      section = JSON.parse(section)

      // Get properties by the section info
      const key = `${section.type}-${i}`
      const filteredPosts = filtered[key]
      const emptyMessage = `Create content with the ${_.join(section.tags, ', ')} tags.`

      // Get the section component
      const options = sectionOptions[section.type]
      const Component = dynamic(() => import(`../../components/Sections/${options.file}`))

      // Return the section component
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
    _.forEach(page.sections, section => {
      section = JSON.parse(section)
      if (section.type === 'SectionStandard') {
        SectionStandard = true
      }
    })

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
    <>
      {renderPageHead()}
      <div className={`${styles['page']} ${page.className}`}>
        {renderSections()}
      </div>
    </>
  )
}


Page.getInitialProps = async ({ query, req }) => {

  if (!query.page) {
    query.page = 'home'
  }

  let page
  if (!!req) {
    try {
      const rootUrl = keys.rootURL ? keys.rootURL : ''
      const { data } = await axios.get(`${rootUrl}/api/pages/${query.page}`)
      page = data
    } catch {
      throw new Error('Page not found')
    }
  }

  return { page }
}


export default Page
