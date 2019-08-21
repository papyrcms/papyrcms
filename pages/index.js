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
        perRow: 3,
        emptyMessage: 'Create content with the "sample" tag.'
      }}
    />
    <PostsFilter
      component={SectionMedia}
      posts={props.posts}
      settings={{
        maxPosts: 1,
        postTags: 'video-section'
      }}
      singular
      componentProps={{
        emptyTitle: 'Video Section',
        emptyMessage: 'Create content with the "video-section" tag'
      }}
    />
    <PostsFilter
      component={SectionStandard}
      posts={props.posts}
      settings={{
        postTags: 'sample',
        maxPosts: 2,
      }}
      componentProps={{
        title: 'This is the Standard Section',
        readMore: true,
        emptyMessage: 'Create content with the "sample" tag.'
      }}
    />
    <PostsFilter
      component={SectionMedia}
      posts={props.posts}
      singular
      settings={{
        postTags: 'parallax-section',
        maxPosts: 1,
      }}
      componentProps={{
        fixed: true,
        alt: 'Parallax Image',
        emptyTitle: 'This is the parallax section',
        emptyMessage: 'Create content with the "parallax-section" tag.'
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
        readMore: true,
        emptyMessage: 'Create content with the "sample" tag.'
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
        timer: 5000,
        emptyTitle: 'This is the slideshow section',
        emptyMessage: 'Create content with the "slideshow-section" tag.'
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
        mapLocation: 'end',
        emptyTitle: 'This is the maps section',
        emptyMessage: 'Create content with the "maps-section" and "main" tags. Be sure to include a post with the "latitude" tag and "logintude" tag as well.'
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
