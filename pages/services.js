import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../config/keys'
import PostsFilter from '../components/PostsFilter'
import { SectionStandard } from '../components/Sections/'

const ServicesPage = props => (
  <PostsFilter
    component={SectionStandard}
    posts={props.posts}
    settings={{
      postTags: 'services',
      maxPosts: 9999
    }}
    componentProps={{
      title: 'Services',
      className: 'services-page'
    }}
  />
)


ServicesPage.getInitialProps = () => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const posts = await axios.get(`${rootUrl}/api/published_posts`)

  return { posts: posts.data }
}


const mapStateToProps = state => {
  return { posts: state.posts, settings: state.settings }
}


export default connect(mapStateToProps)(ServicesPage)
