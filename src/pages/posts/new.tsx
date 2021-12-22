import React, { useContext } from 'react'
import Error from 'next/error'
import { useUser } from '@/context'
import { PostsForm } from '@/components'

const PostNew = () => {
  const { currentUser } = useUser()
  if (!currentUser?.isAdmin) return <Error statusCode={403} />

  return <PostsForm pageTitle="New Content" />
}

export default PostNew
