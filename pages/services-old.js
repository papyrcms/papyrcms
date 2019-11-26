import React from 'react'
import filterPosts from '../components/filterPosts'
import { SectionStandard } from '../components/Sections'


const ServicesPage = props => (
  <SectionStandard
    readMore
    contentLength={300}
    posts={props.posts}
    title="Services"
    className="services-page"
    emptyMessage="Create content with the 'services' tag."
  />
)


const settings = {
  postTags: 'services'
}


export default filterPosts(ServicesPage, settings)
