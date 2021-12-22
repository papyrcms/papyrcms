import { Post } from '@/types'
import { createContext, useContext } from 'react'

type PostContext = {
  posts: Post[]
  setPosts: Function
}

export const postsContext = createContext<PostContext>({
  posts: [],
  setPosts: (posts: Post[]) => {},
})

const usePosts = () => useContext(postsContext)
export default usePosts
