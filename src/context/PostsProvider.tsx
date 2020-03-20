import React, { useState } from 'react'
import postsContext from './postsContext'

type Props = {
  posts: Array<Post>,
  children: any
}

const PostsProvider = (props: Props) => {

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
