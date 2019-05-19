import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import PostsFilter from '../components/PostsFilter'
import SectionCards from '../components/SectionCards'
import SectionMedia from '../components/SectionMedia'
import SectionStandard from '../components/SectionStandard'
import SectionSlideshow from '../components/SectionSlideshow'
import SectionMaps from '../components/SectionMaps'

class Landing extends Component {

  static async getInitialProps(context) {

    let posts = []

    if (!!context.res) {
      posts = context.query.posts
    } else {
      const response = await axios.get(`/api/published_posts`)
      posts = response.data
    }

    return { posts }
  }


  render() {

    const { posts } = this.props

    return (
      <div className="landing">
        <PostsFilter
          component={SectionCards}
          posts={posts}
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
          posts={posts}
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
          posts={posts}
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
          posts={posts}
          settings={{
            postTags: 'books',
            maxPosts: 1
          }}
          componentProps={{
            className: 'section-image',
            fixed: true
          }}
        />
        <PostsFilter
          component={SectionCards}
          posts={posts}
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
          posts={posts}
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
          posts={posts}
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
  }
}


const mapStateToProps = state => {
  return { posts: state.posts, settings: state.settings }
}


export default connect(mapStateToProps)(Landing)
