import { Page } from '@/types'
import React, { useContext } from 'react'
import Error from 'next/error'
import { useRouter } from 'next/router'
import axios from 'axios'
import _ from 'lodash'
import {
  postsContext,
  pagesContext,
  sectionOptionsContext,
} from '@/context'
import { PageHead } from '@/components'
import { usePostFilter } from '@/hooks'
import keys from '@/keys'
import styles from './page.module.scss'
import * as Components from '@/components'

type Props = {
  previewPage?: Page
  page?: Page
}

const PageRenderer = (props: Props) => {
  // Determine if this is a page or the preview on the builder
  let page = props.previewPage ? props.previewPage : props.page

  // On a client load, we are not fetching the page from the server,
  // So we'll get it from the pages in our pages context
  const { query } = useRouter()
  const { pages } = useContext(pagesContext)
  if (!page) {
    _.forEach(pages, (foundPage) => {
      if (foundPage.route === '') foundPage.route = 'home'
      if (foundPage.route === query.page) page = foundPage
    })

    // If the page was still not found, don't return anything
    if (!page) {
      return <Error statusCode={404} />
    }
  }

  // Get our filter settings from the page sections
  const settings: any = []
  _.forEach(page.sections, (section, i) => {
    settings.push({
      propName: `${section.type}-${i}`,
      maxPosts: section.maxPosts,
      postTags: section.tags,
      strictTags: true,
    })
  })

  // Get posts and filter those by the settings
  const { posts } = useContext(postsContext)
  const filtered = usePostFilter(posts, settings)

  // Get our section options
  const { sectionOptions } = useContext(sectionOptionsContext)

  const renderSections = (page: Page) => {
    return _.map(page.sections, (section, i) => {
      // Get properties by the section info
      const key = `${section.type}-${i}`
      const filteredPosts = filtered[key]
      const emptyMessage = `Create content with the ${_.join(
        section.tags,
        ', '
      )} tags.`

      // Get the section component
      const options = sectionOptions[section.type]

      // @ts-ignore Not sure how to fix this
      let Component: React.FC = Components[options.component]

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

  const renderPageHead = (page: Page) => {
    let SectionStandard = false
    _.forEach(page.sections, (section) => {
      if (section.type === 'SectionStandard') {
        SectionStandard = true
      }
    })

    let title
    const headerSettings = {
      maxPosts: 1,
      postTags: ['section-header'],
    }
    const {
      posts: [headerPost],
    } = usePostFilter(posts, headerSettings)
    if (
      !SectionStandard &&
      page.route !== 'home' &&
      page.title &&
      headerPost
    ) {
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
      {renderPageHead(page)}
      <div className={`${styles.page} ${page.className}`}>
        {renderSections(page)}
      </div>
    </>
  )
}

PageRenderer.getInitialProps = async ({
  query,
  req,
}: {
  query: { page: string }
  req: any
}) => {
  if (!query.page) {
    query.page = 'home'
  }

  let page
  if (!!req) {
    try {
      const rootUrl = keys.rootURL ? keys.rootURL : ''
      const { data } = await axios.get(
        `${rootUrl}/api/pages/${query.page}`
      )
      page = data
    } catch {
      return {}
    }
  }

  return { page }
}

export default PageRenderer
