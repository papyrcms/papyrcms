import React, { useState } from 'react'
import postsContext from './postsContext'

const PostsProvider = props => {

  const [posts, setPosts] = useState(props.posts)

  return (
    <postsContext.Provider
      value={{
        posts,
        setPosts
      }}
    >
      {props.children}
    </postsContext.Provider>
  )
}

export default PostsProvider
