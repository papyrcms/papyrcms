import _ from 'lodash'


const filterPosts = (posts, settings) => {

  const filterByPublished = (postsToFilter, filters) => {
    const { showAll } = filters

    if (!showAll) {
      postsToFilter = _.filter(postsToFilter, post => post.published)
    }

    return postsToFilter
  }


  const filterByMaxPosts = (postsToFilter, filters) => {
    const { maxPosts } = filters

    if (maxPosts) {
      postsToFilter.length = maxPosts
    }

    return _.filter(postsToFilter, post => !!post)
  }


  const filterByPostTags = (postsToFilter, filters) => {
    const { postTags, strictTags } = filters

    // Filter posts by postTags
    if (postTags && postTags.length > 0) {
      return _.filter(postsToFilter, post => {
        let included = false

        if (
          typeof postTags === 'string' &&
          post.tags.includes(postTags)
        ) {
          included = true
        } else if (Array.isArray(postTags)) {
          for (const tag of postTags) {
            if (post.tags.includes(tag)) {
              included = true
            }
            if (strictTags && !post.tags.includes(tag)) {
              included = false
              break
            }
          }
        }

        return included
      })
    }

    return postsToFilter
  }


  const orderPosts = (postsToFilter) => {

    const orderedPosts = []
    const unorderedPosts = []

    for (const post of postsToFilter) {
      let found = false

      for (const tag of post.tags) {
        if (tag.includes('order-')) {
          // use index of a tag such as order-2 to be index 2
          orderedPosts[parseInt(_.split(tag, '-')[1])] = post
          found = true
          break
        }
      }

      if (found) {
        continue
      } else {
        unorderedPosts.push(post)
      }
    }

    return _.filter([...orderedPosts, ...unorderedPosts], post => !!post)
  }


  const filterPosts = (postsToFilter, filters) => {

    postsToFilter = filterByPublished(postsToFilter, filters)
    postsToFilter = filterByPostTags(postsToFilter, filters)
    postsToFilter = orderPosts(postsToFilter)
    postsToFilter = filterByMaxPosts(postsToFilter, filters)

    return postsToFilter
  }


  // Begin the filtering
  const filtered = {}

  if (Array.isArray(settings)) {
    for (const filters of settings) {
      if (filters.propName) {
        filtered[filters.propName] = filterPosts(posts, filters)
      }
    }
  } else {
    filtered['posts'] = filterPosts(posts, settings)
  }

  return filtered
}


export default filterPosts
