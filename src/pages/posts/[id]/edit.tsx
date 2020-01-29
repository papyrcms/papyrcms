import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import PostsForm from '../../../components/PostsForm/'
import keys from '../../../config/keys'


const PostsEdit = props => (
  <PostsForm
    pageTitle="Edit Post"
    post={props.post}
    apiEndpoint={`/api/posts/${props.post._id}`}
    editing
  />
)


PostsEdit.getInitialProps = async ({ req, query }) => {

  // Depending on if we are doing a client or server render
  let axiosConfig = {}
  if (!!req) {
    axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie || ''
      }
    }
  }

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const res = await axios.get(`${rootUrl}/api/posts/${query.id}`, axiosConfig)

  return { post: res.data }
}


const mapStateToProps = state => {
  return { post: state.post }
}


export default connect(mapStateToProps)(PostsEdit)
