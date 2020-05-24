import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import userContext from '@/context/userContext'
import PostsForm from '@/components/PostsForm'
import keys from '@/keys'


const BlogEdit = (props) => {

  const { currentUser } = useContext(userContext)
  if (!currentUser || !currentUser.isAdmin) return null

  const [blog, setBlog] = useState(props.blog || [])
  const { query } = useRouter()

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      const getBlog = async () => {
        const { data: blog } = await axios.get(`/api/blogs/${query.id}`)
        setBlog(blog)
      }
      getBlog()
    }
  }, [])

  return (
    <PostsForm
      pageTitle="Edit Blog Post"
      post={blog}
      apiEndpoint={`/api/blogs/${blog._id}`}
      redirectRoute="/blog/all"
      editing
    />
  )
}


BlogEdit.getInitialProps = async ({ query }) => {
  try {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const { data: blog } = await axios.get(`${rootUrl}/api/blogs/${query.id}`)

    return { blog }
  } catch (err) {
    return {}
  }
}


export default BlogEdit
