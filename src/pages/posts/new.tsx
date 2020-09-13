import React, { useContext } from 'react'
import Error from 'next/error'
import userContext from '@/context/userContext'
import { PostsForm } from '@/components'

const PostNew = () => {
  const { currentUser } = useContext(userContext)
  if (!currentUser || !currentUser.isAdmin)
    return <Error statusCode={403} />

  return <PostsForm pageTitle="New Content" />
}

export default PostNew
