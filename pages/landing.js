import React from 'react'
import filterPosts from '../components/filterPosts'
import {
  SectionCards,
  SectionMedia,
  SectionStandard,
} from '../components/Sections'


const LandingPage = props => (

  <div className="landing">

    <SectionStandard
      posts={props.goalsPosts}
      title="Our Mission"
      contentLength={300}
      readMore={false}
    />

    <SectionMedia
      post={props.parallaxPosts[0]}
      fixed
      alt="code"
      emptyTitle="This is the parallax section"
      emptyMessage="Create Content with the 'landing-parallax' tag."
    />

    <SectionCards
      posts={props.portfolioPosts}
      title="Our work"
      contentLength={120}
      readMore
      perRow={3}
    />

  </div>
)


const settings = [
  {
    propName: 'goalsPosts',
    postTags: 'landing-goals',
    maxPosts: 3,
  },
  {
    propName: 'parallaxPosts',
    postTags: 'landing-parallax',
    maxPosts: 1
  },
  {
    propName: 'portfolioPosts',
    maxPosts: 3,
    postTags: ['portfolio', 'web'],
    strictTags: true
  }
]


export default filterPosts(LandingPage, settings)
