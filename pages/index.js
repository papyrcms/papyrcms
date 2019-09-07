import React from 'react'
import { connect } from 'react-redux'
import PostsFilter from '../components/PostsFilter'
import {
  SectionCards,
  SectionMedia,
  SectionStandard,
} from '../components/Sections/'


const LandingPage = props => (

  <div className="landing">

    <PostsFilter
      component={SectionStandard}
      posts={props.posts}
      settings={{
        postTags: 'landing-goals',
        maxPosts: 3,
      }}
      componentProps={{
        title: 'Our Mission',
        contentLength: 300,
        readMore: false,
      }}
    />

    <PostsFilter
      component={SectionMedia}
      posts={props.posts}
      singular
      settings={{
        postTags: 'landing-parallax',
        maxPosts: 1
      }}
      componentProps={{
        fixed: true,
        alt: 'code',
        emptyTitle: 'This is the parallax section',
        emptyMessage: 'Create content with the "landing-parallax" tag.'
      }}
    />

    <PostsFilter
      component={SectionCards}
      posts={props.posts}
      settings={{
        maxPosts: 3,
        postTags: ['portfolio', 'web']
      }}
      componentProps={{
        title: 'Our work',
        contentLength: 120,
        readMore: true,
        perRow: 3
      }}
    />

  </div>
)


const mapStateToProps = state => {
  return { posts: state.posts }
}


export default connect(mapStateToProps)(LandingPage)
