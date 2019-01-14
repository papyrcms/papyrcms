import React, { Component } from 'react'
import _ from 'lodash'

class PostsFilter extends Component {

  constructor( props ) {

    super( props )

    let posts = []
    let numberPosts = 0
    const { maxPosts, postTags } = this.props.settings

    // Filter posts by postTags and maxPosts
    if ( !!postTags && postTags.length > 0 ) {
      posts = props.posts.filter( post => {
        let included = false

        if ( 
          typeof postTags === 'string' &&
          post.tags.includes(postTags) &&
          numberPosts < maxPosts
        ) {
          included = true
        } else {
          _.map( postTags, tag => {
            if ( post.tags.includes( tag ) && numberPosts < maxPosts ) {
              included = true
            }
          });
        }

        if ( included ) { numberPosts++ }
        return included
      });
    } else {
      posts = props.posts
    }

    this.state = { posts }
  }


  render() {

    return (
      <this.props.component 
        posts={ this.state.posts }
        { ...this.props.componentProps }
      />
    );
  }
}


export default PostsFilter
