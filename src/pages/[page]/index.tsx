import { Page, Post } from '@/types'
import React, { useContext } from 'react'
import Error from 'next/error'
import { useRouter } from 'next/router'
import axios from 'axios'
import {
  postsContext,
  pagesContext,
  sectionOptionsContext,
  blogsContext,
  storeContext,
  eventsContext,
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
    pages.forEach((foundPage) => {
      if (foundPage.route === '') foundPage.route = 'home'
      if (foundPage.route === query.page) page = foundPage
    })

    // If the page was still not found, don't return anything
    if (!page) {
      return <Error statusCode={404} />
    }
  }

  // Get our filter settings from the page sections
  const postSettings: any = []
  const blogSettings: any = []
  const eventSettings: any = []
  const productSettings: any = []

  page.sections.forEach((section, i) => {
    const settings = {
      propName: `${section.type}-${i}`,
      maxPosts: section.maxPosts,
      postTags: section.tags,
      strictTags: true,
    }

    switch (section.postType) {
      case 'post':
        postSettings.push(settings)
        break
      case 'blog':
        blogSettings.push(settings)
        break
      case 'event':
        eventSettings.push(settings)
        break
      case 'product':
        productSettings.push(settings)
        break
    }
  })

  // Get posts and filter those by the settings
  const { posts } = useContext(postsContext)
  const { blogs } = useContext(blogsContext)
  const { events } = useContext(eventsContext)
  const { products } = useContext(storeContext)

  const filteredPosts = usePostFilter(posts, postSettings)
  const filteredBlogs = usePostFilter(blogs, blogSettings)
  const filteredEvents = usePostFilter(events, eventSettings)
  const filteredProducts = usePostFilter(products, productSettings)

  // Get our section options
  const { sectionOptions } = useContext(sectionOptionsContext)

  const renderSections = (page: Page) => {
    return page.sections.map((section, i) => {
      // Get properties by the section info
      const key = `${section.type}-${i}`
      let filtered: Post[] = []
      let path: string
      switch (section.postType) {
        case 'post':
          path = 'posts'
          filtered = filteredPosts[key]
          break
        case 'blog':
          path = 'blog'
          filtered = filteredBlogs[key]
          break
        case 'event':
          path = 'events'
          filtered = filteredEvents[key]
          break
        case 'product':
          path = 'store'
          filtered = filteredProducts[key]
          break
      }
      const tags = Array.isArray(section.tags)
        ? section.tags.join(', ')
        : section.tags
      const emptyMessage = `Create content with the ${tags} tags.`

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
          post={filtered[0]}
          posts={filtered}
          emptyTitle={section.title || ''}
          emptyMessage={emptyMessage || ''}
          alt={section.title || ''}
          path={path}
          {...options.defaultProps}
        />
      )
    })
  }

  const renderPageHead = (page: Page) => {
    let SectionStandard = false
    page.sections.forEach((section) => {
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
