import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Link from 'next/link'
import keys from '../config/keys'
import PostsFilter from '../components/PostsFilter'
import { SectionStandard } from '../components/Sections/'

class BlogPage extends Component {

  static async getInitialProps() {

    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const blogs = await axios.get(`${rootUrl}/api/published_blogs`)

    return { blogs: blogs.data }
  }


  renderAllBlogsLink() {

    if (this.props.blogs.length > 5) {
      return (
        <Link href="/blog_all" as="/blog/all">
          <a className="blog-page__button button button-secondary u-margin-bottom-small">See all blog posts</a>
        </Link>
      )
    }
  }


  render() {

    return (
      <div className="blog-page">
        <PostsFilter
          posts={this.props.blogs}
          settings={{
            maxPosts: "5"
          }}
          component={SectionStandard}
          componentProps={{
            title: 'Blog',
            mediaLeft: true,
            readMore: true,
            path: 'blog',
            emptyMessage: 'There are no blogs yet.',
            showDate: true
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
