import { Blog } from '@/types'
import { createContext } from 'react'

type BlogContext = {
  blogs: Blog[]
  setBlogs: Function
}

export default createContext<BlogContext>({
  blogs: [],
  setBlogs: (blogs: Blog[]) => {},
})
