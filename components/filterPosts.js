import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

const filterPosts = (WrappedComponent, settings) => {

  return class extends Component {

    static getInitialProps = WrappedComponent.getInitialProps


    constructor(props) {

      super(props)

      const state = {}

      let posts = settings.postType ? props[settings.postType] : props.posts

      if (Array.isArray(settings)) {

        for (const filters of settings) {
          state[filters.propName] = this.filterPosts(posts, filters)
        }

      } else {

        state['posts'] = this.filterPosts(posts, settings)

      }

      this.state = state
    }


    filterPosts(posts, filters) {

      posts = this.filterPostsByPostTags(posts, filters)
      posts = this.filterPostsByMaxPosts(posts, filters)
      posts = this.orderPosts(posts)

      return posts
    }


    filterPostsByMaxPosts(posts, filters) {

      const { maxPosts } = filters

      if (maxPosts) {

        let count = 0

        return posts.filter(post => {

          count++

          if (count <= maxPosts) {
            return post
          }
        })
      }

      return posts
    }


    filterPostsByPostTags(posts, filters) {

      const { postTags, strictTags } = filters

      // Filter posts by postTags
      if (!!postTags && postTags.length > 0) {

        return posts.filter(post => {

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

      return posts
    }


    orderPosts(posts) {

      const orderedPosts = []
      const unorderedPosts = []

      for (const post of posts) {
        let found = false

        for (const tag of post.tags) {
          if (tag.includes('order-')) {
            // use index of a tag such as order-2 to be index 2
            orderedPosts[parseInt(tag.split('-')[1])] = post
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

      return [...orderedPosts, ...unorderedPosts].filter(post => !!post)
    }


    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
        />
      )
    }
  }
}


const mapStateToProps = ({ posts, blogs, events, page }) => {
  return { posts, blogs, events, page }
}


export default compose(
  connect(mapStateToProps),
  filterPosts
)
