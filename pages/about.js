import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../config/keys'
import PostsFilter from '../components/PostsFilter'
import { SectionStandard } from '../components/Sections/'

const AboutPage = props => (
  <PostsFilter
    component={SectionStandard}
    posts={props.posts}
    settings={{ maxPosts: 1, postTags: ['about'] }}
    componentProps={{ title: 'About', className: 'about-page', emptyMessage: 'Coming soon' }}
  />
)


AboutPage.getInitialProps = () => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const posts = await axios.get(`${rootUrl}/api/published_posts`)

  return { posts: posts.data }
}


const mapStateToProps = state => {
  return { posts: state.posts }
}


export default connect(mapStateToProps)(AboutPage)
