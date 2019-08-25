import React, { Component } from 'react'


/**
 * PostsFilter filters an array of posts by tags and number of posts
 * to provide for a component
 * 
 * @prop posts - Array [Object - Any posts to run through the filter]
 * @prop component - Component/Function - The component to pass the filtered posts to as this.props.posts
 * @prop componentProps - Object - Any props required for the passed component
 * @prop singular - Boolean - whether or not the child component expects the "posts" prop or "post"
 * @prop settings - Object {
 *   maxPosts - Integer - The maximum number of posts to render in the passed component
 *   postTags - Array [String - Any accepted tags to use in the passed component]
 *   strictTags - Array [String - Any required tags to use in the passed component]
 * }
 */
class PostsFilter extends Component {

  constructor(props) {

    super(props)

    let posts = props.posts

    posts = this.filterPostsByPostTags(posts)
    posts = this.orderPosts(posts)
    posts = this.filterPostsByMaxPosts(posts)

    this.state = { posts }
  }


  filterPostsByMaxPosts(posts) {

    const { maxPosts } = this.props.settings

    if (maxPosts) {

      let count = 0

      return posts.filter(post => {

        count++

        if (count <= maxPosts) { return post }
      })
    }

    return posts
  }


  filterPostsByPostTags(posts) {

    const { postTags, strictTags } = this.props.settings

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

    if (this.props.singular) {
      return (
        <this.props.component
          post={this.state.posts[0]}
          {...this.props.componentProps}
        />
      )
    }

    return (
      <this.props.component
        posts={this.state.posts}
        {...this.props.componentProps}
      />
    )
  }
}


export default PostsFilter
