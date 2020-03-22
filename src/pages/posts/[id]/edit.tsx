import React, { useContext, useEffect, useState } from 'react'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import axios from 'axios'
import userContext from '../../../context/userContext'
import PostsForm from '../../../components/PostsForm/'
import keys from '../../../config/keys'

type Props = {
  post: Post
}

const PostsEdit = (props: Props) => {

  const { currentUser } = useContext(userContext)
  if (!currentUser || !currentUser.isAdmin) return null

  const { query } = useRouter()
  const [post, setPost] = useState(props.post)
  useEffect(() => {
    const resetPost = async () => {
      if (currentUser && currentUser.isAdmin) {
        const { data: foundPost } = await axios.get(`/api/posts/${query.id}`)
        setPost(foundPost)
      }
    }
    resetPost()
  }, [currentUser])


  return (
    <PostsForm
      pageTitle="Edit Post"
      post={post}
      apiEndpoint={`/api/posts/${post._id}`}
      editing
    />
  )
}


PostsEdit.getInitialProps = async ({ query }: NextPageContext) => {
  try {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const { data: post } = await axios.get(`${rootUrl}/api/posts/${query.id}`)

    return { post }
  } catch (err) {
    return {}
  }
}


export default PostsEdit
