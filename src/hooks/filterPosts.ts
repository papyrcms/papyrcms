import _ from 'lodash'

const filterPosts = (posts, settings) => {

  const filterByMaxPosts = (postsToFilter, filters) => {
    const { maxPosts } = filters

    if (maxPosts) {
      let count = 0
      return _.filter(postsToFilter, post => {
        count++
        if (count <= maxPosts) {
          return post
        }
      })
    }

    return postsToFilter
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


  const orderPosts = postsToFilter => {

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

    postsToFilter = filterByPostTags(postsToFilter, filters)
    postsToFilter = orderPosts(postsToFilter)
    postsToFilter = filterByMaxPosts(postsToFilter, filters)

    return postsToFilter
  }


  // Begin the filtering
  const filtered: any = {}

  if (Array.isArray(settings)) {
    for (const filters of settings) {
      filtered[filters.propName] = filterPosts(posts, filters)
    }
  } else {
    filtered['posts'] = filterPosts(posts, settings)
  }

  return filtered
}


export default filterPosts
