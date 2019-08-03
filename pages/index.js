import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import PostsFilter from '../components/PostsFilter'
import { 
  SectionCards,
  SectionMedia,
  SectionStandard,
  SectionSlideshow,
  SectionMaps
} from '../components/Sections/'

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
        title: 'This is the 3 Card Section',
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
        title: '4 Card Section',
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

  let googleMapsKey = ''

  if (!!context.res) {
    googleMapsKey = context.query.googleMapsKey
  } else {
    const res = await axios.post('/api/googleMapsKey')
    googleMapsKey = res.data
  }

  return { googleMapsKey }
}


const mapStateToProps = state => {
  return { posts: state.posts }
}


export default connect(mapStateToProps)(LandingPage)
