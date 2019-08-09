import React from 'react'
import { connect } from 'react-redux'
import PostsFilter from '../components/PostsFilter'
import { SectionStandard } from '../components/Sections/'

const Portfolio = props => (
  <PostsFilter
    component={SectionStandard}
    posts={props.posts}
    settings={{
      postTags: ['web', 'portfolio'],
      maxPosts: 9999,
      strictTags: true
    }}
    componentProps={{
      title: 'My Work',
      className: 'portfolio-page',
    }}
  />
)


const mapStateToProps = state => {
  return { posts: state.posts, settings: state.settings }
}


export default connect(mapStateToProps)(Portfolio)
