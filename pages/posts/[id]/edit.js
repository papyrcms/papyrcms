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


PostsEdit.getInitialProps = async context => {

  let { id, post } = context.query

  if (!post) {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const res = await axios.get(`${rootUrl}/api/posts/${id}`)
    post = res.data
  }

  return { post }
}


const mapStateToProps = state => {
  return { post: state.post }
}


export default connect(mapStateToProps)(PostsEdit)
