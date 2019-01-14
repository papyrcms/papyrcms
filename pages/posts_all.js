import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../config/keys'
import PostIndex from '../components/PostIndex'

class PostsAll extends Component {

  static async getInitialProps() {

    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const posts = await axios.get( `${rootUrl}/api/posts` )

    return { posts: posts.data }
  }


  constructor( props ) {

    super( props )

    this.state = { searchText: '', posts: props.posts }
  }


  onSearchTextChange( event ) {

    this.setState({ searchText: event.target.value })

    let foundPosts = []

    // Go through each post
    _.map( this.props.posts, post => {

      // Go through each post's tag
      _.map( post.tags, tag => {
        let isFound = false

        _.map( foundPosts, foundPost => {
          if ( foundPost._id === post._id ) {
            isFound = true
          }
        })

        // If we are searching for the tag and we haven't already included the post, include it
        if ( tag.includes( event.target.value ) && !isFound ) {
          foundPosts.push( post )
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
          <h2 className="heading-secondary posts-all-page__header">Posts</h2>
          <div className="posts-all-page__search">
            <label htmlFor="posts-search" className="posts-all-page__search--label">Search Posts</label>
            <input
              id="posts-search"
              placeholder="search tags here"
              type="text"
              name="search"
              value={ searchText }
              onChange={ event => this.onSearchTextChange( event ) }
              className="posts-all-page__search--input"
              />
          </div>
        </div>
        <PostIndex posts={ posts } />
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { posts: state.posts }
}


export default connect( mapStateToProps )( PostsAll )
