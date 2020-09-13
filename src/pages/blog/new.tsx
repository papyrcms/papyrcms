import React, { useContext } from 'react'
import Error from 'next/error'
import { userContext } from '@/context'
import { PostsForm } from '@/components'

const BlogNew = () => {
  const { currentUser } = useContext(userContext)
  if (!currentUser || !currentUser.isAdmin)
    return <Error statusCode={403} />

  return (
    <PostsForm
      pageTitle="New Blog Post"
      apiEndpoint="/api/blogs"
      redirectRoute="/blog/all"
    />
  )
}

export default BlogNew
