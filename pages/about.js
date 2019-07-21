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


AboutPage.getInitialProps = async () => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const posts = await axios.get(`${rootUrl}/api/published_posts`)

  return { posts: posts.data }
}


const mapStateToProps = state => {
  return { posts: state.posts }
}


export default connect(mapStateToProps)(AboutPage)
