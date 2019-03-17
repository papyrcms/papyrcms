import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../config/keys'
import PostsFilter from '../components/PostsFilter'
import SectionCards from '../components/SectionCards'

class StorePage extends Component {

  static async getInitialProps() {

    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const posts = await axios.get(`${rootUrl}/api/published_posts`)

    return { posts: posts.data }
  }


  render() {

    return (
      <div>
        <PostsFilter
          component={ SectionCards }
          posts={ this.props.posts }
          settings={{
            postTags: "product",
            maxPosts: "9999"
          }}
          componentProps={{
            title: 'Store',
            perRow: 4,
            readMore: true,
            path: 'store',
            contentLength: 200
          }}
        />
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { posts: state.posts, settings: state.settings }
}


export default connect( mapStateToProps )( StorePage )
