import React, { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../../config/keys'
import PostIndex from '../../components/PostIndex'
import Input from '../../components/Input'


const Posts = props => {


  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState(props.posts)


  const onSearchTextChange = event => {

    // Set the search bar state
    setSearch(event.target.value)

    let foundPosts = props.posts.filter(post => {
      let isFound = false

      // Go through each post's tags
      for (const tag of post.tags) {

        // If we find it, mark it and break out of this loop
        if (tag.includes(event.target.value)) {
          isFound = true
          break
        }
      }

      return isFound
    })

    setPosts(foundPosts)
  }


  return (
    <div className="posts-all-page">
      <div className="posts-all-page__top">
        <h2 className="heading-secondary posts-all-page__header">My Content</h2>
        <Input
          id="posts-search"
          label="Search Posts"
          placeholder="search tags here"
          name="search"
          value={search}
          onChange={onSearchTextChange}
          className="posts-all-page__input"
        />
      </div>
      <PostIndex posts={posts} />
    </div>
  )
}


Posts.getInitialProps = async ({ req }) => {

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


const mapStateToProps = state => {
  return { posts: state.posts }
}


export default connect(mapStateToProps)(Posts)
