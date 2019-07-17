/**
 * PostsFilter filters an array of posts by tags and number of posts
 * to provide for a component
 * 
 * props include:
 *   settings: Object{
 *     maxPosts: Integer - The maximum number of posts to render in the passed component
 *     postTags: Array [String - Any accepted tags to use in the passed component]
 *     strictTags: Array [String - Any required tags to use in the passed component]
 *   }
 *   posts: Array [Object - Any posts to run through the filter]
 *   component: Component/Function - The component to pass the filtered posts to as this.props.posts
 *   componentProps: Object - Any props required for the passed component
 */


import React, { Component } from 'react'
import _ from 'lodash'

class PostsFilter extends Component {

  constructor(props) {

    super(props)

    let posts = []
    let numberPosts = 0
    const { maxPosts, postTags, strictTags } = props.settings

    // Filter posts by postTags and maxPosts
    if (!!postTags && postTags.length > 0) {
      posts = props.posts.filter(post => {
        let included = false

        if (
          typeof postTags === 'string' &&
          post.tags.includes(postTags) &&
          numberPosts < maxPosts
        ) {
          included = true
        } else {
          _.map(postTags, tag => {
            if (post.tags.includes(tag) && numberPosts < maxPosts) {

              included = true
            }
            
            if (strictTags && !post.tags.includes(tag)) {
              included = false
            }
          })
        }

        if (included) { numberPosts++ }
        return included
      })

    } else {
      if (!postTags && !!maxPosts) {
        posts = props.posts.filter(post => {
          if (numberPosts < maxPosts) {
            numberPosts++
            return true
          } else {
            return false
          }
        })
      } else {
        posts = props.posts
      }
    }

    this.state = { posts }
  }


  render() {

    return (
      <this.props.component
        posts={this.state.posts}
        {...this.props.componentProps}
      />
    )
  }
}


export default PostsFilter
