import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Link from 'next/link'
import _ from 'lodash'
import keys from '../config/keys'
import PostsFilter from '../components/PostsFilter'
import SectionStandard from '../components/SectionStandard'

class BlogPage extends Component {

  static async getInitialProps() {

    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const blogs = await axios.get(`${rootUrl}/api/published_blogs`)

    return { blogs: blogs.data }
  }


  renderAllBlogsLink() {

    let blogs = []
    _.map(this.props.blogs, blog => {
      if (blog.tags.includes('blog')) {
        blogs.push(blog)
      }
    })

    if (blogs.length > 5) {
      return (
        <Link href="/blog_all" as="/blog/all">
          <a className="blog-page__button button button-secondary">See all blog posts</a>
        </Link>
      )
    }
  }


  render() {

    return (
      <div className="blog-page">
        <PostsFilter
          component={SectionStandard}
          posts={this.props.blogs}
          settings={{
            maxPosts: "5"
          }}
          componentProps={{
            title: 'Blog',
            mediaLeft: true,
            readMore: true,
            path: 'blog'
          }}
        />

        {this.renderAllBlogsLink()}
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { blogs: state.blogs }
}


export default connect(mapStateToProps)(BlogPage)
