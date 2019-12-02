import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import PostsForm from '../../components/PostsForm'
import keys from '../../config/keys'


const BlogEdit = props => (
  <PostsForm
    pageTitle="Edit Blog Post"
    post={props.blog}
    apiEndpoint={`/api/blogs/${props.blog._id}`}
    redirectRoute="/blog/all"
    editing
  />
)


BlogEdit.getInitialProps = async ({ query, req }) => {

  let axiosConfig

  // Depending on if we are doing a client or server render
  if (!!req) {
    axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie
      }
    }
  }

  let { id, blog } = query

  if (!blog) {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const res = await axios.get(`${rootUrl}/api/blogs/${id}`, axiosConfig)
    blog = res.data
  }

  return { blog }
}


const mapStateToProps = state => {
  return { blog: state.blog }
}


export default connect(mapStateToProps)(BlogEdit)
