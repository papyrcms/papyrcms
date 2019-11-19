import React from 'react'
import filterPosts from '../components/filterPosts'
import { SectionStandard } from '../components/Sections/'

const Portfolio = props => (
  <SectionStandard
    posts={props.posts}
    title="My Work"
    className="portfolio-page"
  />
)


const settings = {
  postTags: ['web', 'portfolio'],
  strictTags: true
}


export default filterPosts(Portfolio, settings)
