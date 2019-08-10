import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../config/keys'
import PostIndex from '../components/PostIndex'
import Input from '../components/Input'

class PostsAll extends Component {

  static async getInitialProps({ req }) {

    let axiosConfig = {}

    // Depending on if we are doing a client or server render
    if (!!req) {
      axiosConfig = {
        withCredentials: true,
        headers: {
          Cookie: req.headers.cookie
        }
      }
    }

    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const posts = await axios.get(`${rootUrl}/api/posts`, axiosConfig)

    return { posts: posts.data }
  }


  constructor(props) {

    super(props)

    this.state = { searchText: '', posts: props.posts }
  }


  onSearchTextChange(event) {

    this.setState({ searchText: event.target.value })

    let foundPosts = []

    // Go through each post
    this.props.posts.forEach(post => {

      // Go through each post's tag
      post.tags.forEach(tag => {
        let isFound = false

        foundPosts.forEach(foundPost => {
          if (foundPost._id === post._id) {
            isFound = true
          }
        })

        // If we are searching for the tag and we haven't already included the post, include it
        if (tag.includes(event.target.value) && !isFound) {
          foundPosts.push(post)
        }
      })
    })

    this.setState({ posts: foundPosts })
  }


  render() {

    const { searchText, posts } = this.state

    return (
      <div className="posts-all-page">
        <div className="posts-all-page__top">
          <h2 className="heading-secondary posts-all-page__header">My Content</h2>
          <Input
            id="posts-search"
            label="Search Posts"
            placeholder="search tags here"
            name="search"
            value={searchText}
            onChange={event => this.onSearchTextChange(event)}
            className="posts-all-page__input"
          />
        </div>
        <PostIndex posts={posts} />
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { posts: state.posts }
}


export default connect(mapStateToProps)(PostsAll)
