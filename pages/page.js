import React, { Component } from 'react'
import axios from 'axios'
import keys from '../config/keys'
import {
  SectionStandard,
  SectionCards,
  SectionSlideshow,
  SectionMedia,
  SectionMaps
} from '../components/Sections/'
import PostShow from '../components/PostShow/'
import filterPosts from '../components/filterPosts'


// const page = {
//   className: 'about-page',
//   title: 'About',
//   url: 'about',
//   sections: [{
//     type: 'PostShow',
//     tags: ['about'],
//     title: null,
//     maxPosts: 1,
//     className: 'about-page'
//   }],
// }
const page = {
  className: 'example-page',
  title: 'Example',
  url: 'example',
  sections: [{
    type: 'Parallax',
    tags: ['parallax-section'],
    title: 'Parallax',
    maxPosts: 1,
    className: 'parallax'
  },
  {
    type: 'Standard',
    tags: ['services'],
    title: 'Services',
    maxPosts: 2,
    className: 'services'
  },
  {
    type: 'Slideshow',
    tags: ['slideshow-section'],
    title: 'Slideshow Section',
    maxPosts: 4,
    className: 'slideshow'
  },
  {
    type: 'Cards',
    tags: ['sample'],
    title: 'Samples',
    maxPosts: 3,
    className: 'cards'
  },
  {
    type: 'Media',
    tags: ['video-section'],
    title: 'Video',
    maxPosts: 1,
    className: 'video'
  },
  {
    type: 'Map',
    tags: ['maps-section', 'main'],
    title: 'Mapssss',
    maxPosts: 3,
    className: 'mapp'
  }],
}


class Page extends Component {

  renderSections() {
    return page.sections.map(section => {
      switch (section.type) {
        case 'Map':
          return <SectionMaps
            key={section.className}
            posts={this.props[section.className]}
            emptyTitle={section.title}
            emptyMessage={`Create content with the ${section.tags} tags.`}
          />
        case 'Media':
          return <SectionMedia
            key={section.className}
            post={this.props[section.className][0]}
            alt={section.title}
            emptyTitle={section.title}
            emptyMessage={`Create content with the ${section.tags} tags.`}
          />
        case 'Parallax':
          return <SectionMedia
            key={section.className}
            post={this.props[section.className][0]}
            alt={section.title}
            emptyTitle={section.title}
            emptyMessage={`Create content with the ${section.tags} tags.`}
            fixed
          />
        case 'Slideshow':
          return <SectionSlideshow
            key={section.className}
            posts={this.props[section.className]}
            timer={5000}
            emptyTitle={section.title}
            emptyMessage={`Create content with the ${section.tags} tags.`}
          />
        case 'Cards':
          return <SectionCards
            key={section.className}
            posts={this.props[section.className]}
            title={section.title}
            contentLength={120}
            readMore
            perRow={3}
            emptyMessage={`Create content with the ${section.tags} tags.`}
          />
        case 'Standard':
          return <SectionStandard
            key={section.className}
            readMore
            contentLength={300}
            posts={this.props[section.className]}
            title={section.title}
            className={section.className}
            emptyMessage={`Create content with the ${section.tags} tag.`}
          />
        default:
          return <PostShow
            key={section.className}
            post={this.props[section.className][0]}
            path="post"
            apiPath="/api/posts"
            redirectRoute="/post/all"
            showDate
          />
      }
    })
  }


  render() {
    return (
      <div className={page.className}>
        {this.renderSections()}
      </div>
    )
  }
}


const settings = []
for (const section of page.sections) {
  settings.push({
    propName: section.className,
    maxPosts: section.maxPosts,
    postTags: section.tags,
    strictTags: true
  })
}

export default filterPosts(Page, settings)
