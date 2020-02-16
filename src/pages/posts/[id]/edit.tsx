import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import userContext from '../../../context/userContext'
import { connect } from 'react-redux'
import PostsForm from '../../../components/PostsForm/'
import keys from '../../../config/keys'


const PostsEdit = props => {

  const { currentUser } = useContext(userContext)
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


PostsEdit.getInitialProps = async ({ query }) => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const res = await axios.get(`${rootUrl}/api/posts/${query.id}`)

  return { post: res.data }
}


export default PostsEdit
