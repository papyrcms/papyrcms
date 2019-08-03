import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../config/keys'
import PostsFilter from '../components/PostsFilter'
import PostShow from '../components/PostShow/'

const AboutPage = props => (
  <PostsFilter
    component={PostShow}
    posts={props.posts}
    settings={{ maxPosts: 1, postTags: ['about'] }}
    singular
    componentProps={{ 
      className: 'about-page',
      emptyMessage: 'Coming soon',
      path: "posts",
      apiPath: "/api/posts",
      redirectRoute: "/about"
    }}
  />
)


const mapStateToProps = state => {
  return { posts: state.posts }
}


export default connect(mapStateToProps)(AboutPage)
