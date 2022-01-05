import { Blog } from '@/types'
import { useState } from 'react'
import { blogsContext } from './blogsContext'

interface Props {
  blogs: Blog[]
  children: any
}

const BlogsProvider = (props: Props) => {
  const [blogs, setBlogs] = useState(props.blogs)

  return (
    <blogsContext.Provider
      value={{
        blogs,
        setBlogs,
      }}
    >
      {props.children}
    </blogsContext.Provider>
  )
}

export default BlogsProvider
