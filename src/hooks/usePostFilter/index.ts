import { Post } from '@/types'

type Filters = {
  propName?: string
  showAll?: boolean
  maxPosts?: number
  postTags?: string[]
  strictTags?: boolean
}

const usePostFilter = <T extends Post>(
  posts: T[],
  settings: Filters | Filters[]
) => {
  const filterByPublished = (
    postsToFilter: T[],
    filters: Filters
  ) => {
    const { showAll } = filters

    if (!showAll) {
      postsToFilter = postsToFilter.filter((post) => post.isPublished)
    }

    return postsToFilter
  }

  const filterByMaxPosts = (postsToFilter: T[], filters: Filters) => {
    const { maxPosts } = filters

    if (maxPosts || maxPosts === 0) {
      postsToFilter.length = maxPosts
    }

    return postsToFilter.filter((post) => !!post)
  }

  const filterByPostTags = (postsToFilter: T[], filters: Filters) => {
    const { postTags, strictTags } = filters

    // Filter posts by postTags
    if (postTags && postTags.length > 0) {
      return postsToFilter.filter((post) => {
        let included = false
        let done = false

        if (
          typeof postTags === 'string' &&
          post.tags.includes(postTags)
        ) {
          included = true
        } else if (Array.isArray(postTags)) {
          postTags.forEach((tag) => {
            if (!done && post.tags.includes(tag)) {
              included = true
            }
            if (!done && strictTags && !post.tags.includes(tag)) {
              included = false
              done = true
            }
          })
        }

        return included
      })
    }

    return postsToFilter
  }

  const orderPosts = (postsToFilter: T[]) => {
    // First, order by date
    postsToFilter.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0
      return a.createdAt > b.createdAt ? 1 : -1
    })

    const orderedPosts: T[] = []
    const unorderedPosts: T[] = []

    postsToFilter.forEach((post) => {
      let found = false

      post.tags.forEach((tag) => {
        if (!found && tag.includes('order-')) {
          // use index of a tag such as order-2 to be index 2
          orderedPosts[parseInt(tag.split('-')[1])] = post
          found = true
        }
      })

      if (!found) {
        unorderedPosts.push(post)
      }
    })

    return [...orderedPosts, ...unorderedPosts].filter(
      (post) => !!post
    )
  }

  const filterPosts = (postsToFilter: T[], filters: Filters) => {
    postsToFilter = filterByPublished(postsToFilter, filters)
    postsToFilter = filterByPostTags(postsToFilter, filters)
    postsToFilter = orderPosts(postsToFilter)
    postsToFilter = filterByMaxPosts(postsToFilter, filters)

    return postsToFilter
  }

  // Begin the filtering
  const filtered: { [key: string]: T[] } = {}

  if (Array.isArray(settings)) {
    settings.forEach((filters) => {
      if (filters.propName) {
        filtered[filters.propName] = filterPosts(posts, filters)
      }
    })
  } else {
    filtered['posts'] = filterPosts(posts, settings)
  }

  return filtered
}

export default usePostFilter
