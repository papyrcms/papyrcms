import React, { useContext } from 'react'
import userContext from '@/context/userContext'
import PostsForm from '../../components/PostsForm/'

export default () => {

  const { currentUser } = useContext(userContext)
  if (!currentUser || !currentUser.isAdmin) return null

  return <PostsForm pageTitle="New Content" />
}
