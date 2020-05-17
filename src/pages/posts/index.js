import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import _ from 'lodash'
import postsContext from '../../context/postsContext'
import userContext from '../../context/userContext'
import PostIndex from '../../components/PostIndex'
import Input from '../../components/Input'


const Posts = () => {

  const { currentUser } = useContext(userContext)
  const { posts, setPosts } = useContext(postsContext)
  useEffect(() => {
    const resetPosts = async () => {
      if (currentUser && currentUser.isAdmin) {
        const { data: foundPosts } = await axios.get('/api/posts')
        setPosts(foundPosts)
      }
    }
    resetPosts()
  }, [currentUser])


  const [search, setSearch] = useState('')
  const [searchPosts, setSearchPosts] = useState(posts)


  const onSearchTextChange = (event) => {

    // Set the search bar state
    setSearch(event.target.value)

    let foundPosts = _.filter(posts, post => {
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

    setSearchPosts(foundPosts)
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
      <PostIndex posts={searchPosts} />
    </div>
  )
}


export default Posts
