import { Blog } from '@/types'
import { createContext, useContext } from 'react'

type BlogsContext = {
  blogs: Blog[]
  setBlogs: Function
}

export const blogsContext = createContext<BlogsContext>({
  blogs: [],
  setBlogs: (blogs: Blog[]) => {},
})

const useBlogs = () => useContext(blogsContext)
export default useBlogs
