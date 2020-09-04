import { Page } from 'types'
import React, { useContext } from 'react'
import dynamic from 'next/dynamic'
import Error from 'next/error'
import { useRouter } from 'next/router'
import axios from 'axios'
import _ from 'lodash'
import postsContext from '@/context/postsContext'
import pagesContext from '@/context/pagesContext'
import sectionOptionsContext from '@/context/sectionOptionsContext'
import PageHead from '@/components/PageHead'
import usePostFilter from '@/hooks/usePostFilter'
import keys from '@/keys'
import styles from './page.module.scss'

type Props = {
  previewPage?: Page
  page: Page
}

const Page = (props: Props) => {

  // Determine if this is a page or the preview on the builder
  let page = props.previewPage ? props.previewPage : props.page
  
  // On a client load, we are not fetching the page from the server,
  // So we'll get it from the pages in our pages context
  const { query } = useRouter()
  const { pages } = useContext(pagesContext)
  if (!page) {
    _.forEach(pages, foundPage => {
      if (foundPage.route === 'home') foundPage.route = ''
      if (foundPage.route === query.page) page = foundPage
    })

    // If the page was still not found, don't return anything
    if (!page) return <Error statusCode={404} />
  }

  // Get our filter settings from the page sections
  const settings: any = []
  _.forEach(page.sections, (section, i) => {
    const parsedSection = JSON.parse(section)

    settings.push({
      propName: `${parsedSection.type}-${i}`,
      maxPosts: parsedSection.maxPosts,
      postTags: parsedSection.tags,
      strictTags: true
    })
  })

  // Get posts and filter those by the settings
  const { posts } = useContext(postsContext)
  const filtered = usePostFilter(posts, settings)

  // Get our section options
  const { sectionOptions } = useContext(sectionOptionsContext)

  const renderSections = () => {

    return _.map(page.sections, (section, i) => {

      // Parse the section from the page
      const parsedSection = JSON.parse(section)

      // Get properties by the section info
      const key = `${parsedSection.type}-${i}`
      const filteredPosts = filtered[key]
      const emptyMessage = `Create content with the ${_.join(parsedSection.tags, ', ')} tags.`

      // Get the parsedSection component
      const options = sectionOptions[parsedSection.type]
      const Component = dynamic(() => import(`../../components/Sections/${options.file}`))

      // Return the parsedSection component
      return (
        <Component
          key={key}
          title={parsedSection.title}
          className={parsedSection.className || ''}
          post={filteredPosts[0]}
          posts={filteredPosts}
          emptyTitle={parsedSection.title || ''}
          emptyMessage={emptyMessage || ''}
          alt={parsedSection.title || ''}
          {...options.defaultProps}
        />
      )
    })
  }


  const renderPageHead = () => {

    let SectionStandard = false
    _.forEach(page.sections, section => {
      const parsedSection = JSON.parse(section)
      if (parsedSection.type === 'SectionStandard') {
        SectionStandard = true
      }
    })

    let title
    const headerSettings = {
      maxPosts: 1,
      postTags: ['section-header']
    }
    const { posts: [headerPost] } = usePostFilter(posts, headerSettings)
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


Page.getInitialProps = async ({ query, req }: { query: { page: string }, req: any }) => {

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
      return {}
    }
  }

  return { page }
}


export default Page
