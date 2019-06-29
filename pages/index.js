import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import PostsFilter from '../components/PostsFilter'
import SectionCards from '../components/SectionCards'
import SectionMedia from '../components/SectionMedia'
import SectionStandard from '../components/SectionStandard'
import SectionSlideshow from '../components/SectionSlideshow'
import SectionMaps from '../components/SectionMaps'

const LandingPage = props => (
  <div className="landing">
    <PostsFilter
      component={SectionCards}
      posts={props.posts}
      settings={{
        maxPosts: 3,
        postTags: 'sample'
      }}
      componentProps={{
        title: 'This is the Section Card component',
        contentLength: 200,
        readMore: true,
        perRow: 3
      }}
    />
    <PostsFilter
      component={SectionMedia}
      posts={props.posts}
      settings={{
        maxPosts: 1,
        postTags: 'video-section'
      }}
      componentProps={{
        className: "section-video",
        // fixed: true
      }}
    />
    <PostsFilter
      component={SectionStandard}
      posts={props.posts}
      settings={{
        postTags: 'services',
        maxPosts: 2
      }}
      componentProps={{
        title: 'This is the Standard Section',
      }}
    />
    <PostsFilter
      component={SectionMedia}
      posts={props.posts}
      settings={{
        postTags: 'books',
        maxPosts: 1
      }}
      componentProps={{
        className: 'section-image',
        fixed: true,
        alt: 'Some books'
      }}
    />
    <PostsFilter
      component={SectionCards}
      posts={props.posts}
      settings={{
        maxPosts: 4,
        postTags: 'sample'
      }}
      componentProps={{
        title: 'Another Card Section',
        contentLength: 100,
        perRow: 4,
        readMore: true
      }}
    />
    <PostsFilter
      component={SectionSlideshow}
      posts={props.posts}
      settings={{
        maxPosts: 4,
        postTags: 'slideshow-section'
      }}
      componentProps={{
        timer: 5000
      }}
    />
    <PostsFilter
      component={SectionMaps}
      posts={props.posts}
      settings={{
        maxPosts: 3,
        postTags: ['maps-section', 'main'],
        strictTags: true
      }}
      componentProps={{
        mapLocation: 'end'
      }}
    />
  </div>
)


LandingPage.getInitialProps = async context => {

  let posts = []
  let googleMapsKey = ''

  if (!!context.res) {
    posts = context.query.posts
    googleMapsKey = context.query.googleMapsKey
  } else {
    const response = await axios.get(`/api/published_posts`)
    posts = response.data
    const res = await axios.post('/api/googleMapsKey')
    googleMapsKey = res.data
  }

  return { posts, googleMapsKey }
}


const mapStateToProps = state => {
  return { posts: state.posts }
}


export default connect(mapStateToProps)(LandingPage)
