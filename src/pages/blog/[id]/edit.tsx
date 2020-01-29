import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { connect } from 'react-redux'
import PostsForm from '../../../components/PostsForm'
import keys from '../../../config/keys'


const BlogEdit = props => {

  // useEffect(async () => {
  //   const router = useRouter()
  //   console.log(router)
  //   // const { data: blog } = 
  // }, [])

  return (
    <PostsForm
      pageTitle="Edit Blog Post"
      post={props.blog}
      apiEndpoint={`/api/blogs/${props.blog._id}`}
      redirectRoute="/blog/all"
      editing
    />
  )
}


BlogEdit.getInitialProps = async ({ query, req }) => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const { data: blog } = await axios.get(`${rootUrl}/api/blogs/${query.id}`)

  return { blog }
}


const mapStateToProps = state => {
  return { blog: state.blog }
}


export default connect(mapStateToProps)(BlogEdit)
