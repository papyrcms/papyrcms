import React, { Component } from 'react';
import _ from 'lodash';

class PostsFilter extends Component {

  constructor( props ) {

    super( props );

    let posts;
    let numberPosts = 0;

    // Filter posts by postTags and maxPosts
    if ( !!props.postTags && props.postTags.length > 0 ) {
      posts = props.posts.filter( post => {
        let included = false;

        _.map( props.postTags, tag => {
          if ( post.tags.includes( tag ) && numberPosts < props.maxPosts ) {
            included = true;
          }
        });

        if ( included ) { numberPosts++; }
        return included;
      });
    } else {
      posts = props.posts;
    }

    this.state = { posts };
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


export default PostsFilter;
