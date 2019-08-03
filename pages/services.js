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


const mapStateToProps = state => {
  return { posts: state.posts, settings: state.settings }
}


export default connect(mapStateToProps)(ServicesPage)
