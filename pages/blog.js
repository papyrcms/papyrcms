import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Link from 'next/link'
import keys from '../config/keys'
import PostsFilter from '../components/PostsFilter'
import SectionStandard from '../components/SectionStandard'

class BlogPage extends Component {

  static async getInitialProps() {

    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const posts = await axios.get(`${rootUrl}/api/published_posts`)

    return { posts: posts.data }
  }


  renderAllBlogsLink() {

    if ( this.props.posts.length > 5 ) {
      return (
        <Link href="/blog_all" as="/blog/all">
          <a className="blog-page__button button button-secondary">See all posts</a>
        </Link>
      )
    }
  }


  render() {

    return (
      <div className="blog-page">
        <PostsFilter
          component={ SectionStandard }
          posts={ this.props.posts }
          settings={{
            postTags: "blog",
            maxPosts: "5"
          }}
          componentProps={{
            title: 'Blog',
            mediaLeft: true,
            readMore: true,
            path: 'blog'
          }}
        />

        { this.renderAllBlogsLink() }
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { posts: state.posts, settings: state.settings }
}


export default connect( mapStateToProps )( BlogPage )
