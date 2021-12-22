import { useContext } from 'react'
import Error from 'next/error'
import { useUser } from '@/context'
import { PostsForm } from '@/components'

const BlogNew = () => {
  const { currentUser } = useUser()
  if (!currentUser?.isAdmin) return <Error statusCode={403} />

  return (
    <PostsForm
      pageTitle="New Blog Post"
      apiEndpoint="/api/blogs"
      redirectRoute="/blog/all"
    />
  )
}

export default BlogNew
