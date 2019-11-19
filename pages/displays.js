import React from 'react'
import axios from 'axios'
import filterPosts from '../components/filterPosts'
import {
  SectionCards,
  SectionMedia,
  SectionStandard,
  SectionSlideshow,
  SectionMaps
} from '../components/Sections/'

const LandingPage = props => (
  <div className="landing">

    <SectionCards
      posts={props.threeCardPosts}
      title="This is the 3 Card Section"
      contentLength={200}
      readMore
      perRow={3}
      emptyMessage="Create content with the 'sample' tag."
      clickableMedia
    />

    <SectionMedia
      post={props.videoPosts[0]}
      emptyTitle="Video Section"
      emptyMessage="Create content with the 'video-section' tag."
    />

    <SectionStandard
      posts={props.standardPosts}
      title="This is the Standard Section"
      emptyMessage="Create content with the 'sample' tag."
      readMore
      clickableMedia
    />

    <SectionMedia
      post={props.parallaxPosts[0]}
      alt="Parallax Image"
      emptyTitle="This is the parallax section"
      emptyMessage="Create content with the 'parallax-section' tag."
      fixed
    />

    <SectionCards
      posts={props.fourCardPosts}
      title="4 Card Section"
      contentLength={100}
      perRow={4}
      emptyMessage="Create content with the 'sample' tag."
      readMore
      clickableMedia
    />

    <SectionSlideshow
      posts={props.slideshowPosts}
      timer={5000}
      emptyTitle="This is the slideshow section"
      emptyMessage="Create content with the 'slideshow-section' tag."
    />

    <SectionMaps
      posts={props.mapsPosts}
      mapLocation="end"
      emptyTitle="This is the maps section"
      emptyMessage="Create content with the 'maps-section' and 'main' tags. Be sure to include a post with the 'latitude' tag and 'longitude' tag as well."
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


const settings = [
  {
    propName: 'threeCardPosts',
    maxPosts: 3,
    postTags: 'sample'
  },
  {
    propName: 'videoPosts',
    maxPosts: 1,
    postTags: 'video-section'
  },
  {
    propName: 'standardPosts',
    postTags: 'sample',
    maxPosts: 2,
  },
  {
    propName: 'parallaxPosts',
    postTags: 'parallax-section',
    maxPosts: 1,
  },
  {
    propName: 'fourCardPosts',
    maxPosts: 4,
    postTags: 'sample'
  },
  {
    propName: 'slideshowPosts',
    maxPosts: 4,
    postTags: 'slideshow-section'
  },
  {
    propName: 'mapsPosts',
    maxPosts: 3,
    postTags: ['maps-section', 'main'],
    strictTags: true
  },
]


export default filterPosts(LandingPage, settings)
