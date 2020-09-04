import { Post } from 'types'
import { createContext } from 'react'

type PostContext = {
  posts: Post[]
  setPosts: Function
}

export default createContext<PostContext>({
  posts: [],
  setPosts: (posts: Post[]) => {}
})
