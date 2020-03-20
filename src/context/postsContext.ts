import { createContext } from 'react'

type PostsContext = {
  posts: Array<Post>
  setPosts: Function
}

export default createContext<PostsContext>({
  posts: [],
  setPosts: (posts: Array<Post>) => {}
})
