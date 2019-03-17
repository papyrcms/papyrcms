import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../config/keys'
import PostsFilter from '../components/PostsFilter'
import SectionCards from '../components/SectionCards'

class BlogPage extends Component {

  static async getInitialProps(context) {

    let currentUser

    // Depending on if we are doing a client or server render
    if (Object.keys(context.query).length === 0 && context.query.constructor === Object) {
      currentUser = context.reduxStore.getState().currentUser
    } else {
      currentUser = context.query.currentUser
    }

    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const blogRequest = currentUser && currentUser.isAdmin ? 'blogs' : 'published_blogs'
    const blogs = await axios.get(`${rootUrl}/api/${blogRequest}`)

    return { blogs: blogs.data }
  }


  render() {

    return (
      <div>
        <PostsFilter
          component={SectionCards}
          posts={this.props.blogs}
          settings={{
            // postTags: "blog",
            maxPosts: "9999"
          }}
          componentProps={{
            title: 'Blog',
            perRow: 4,
            readMore: true,
            path: 'blog',
            contentLength: 200
          }}
        />
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { blogs: state.blogs, settings: state.settings }
}


export default connect(mapStateToProps)(BlogPage)
