import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import PostsForm from '../components/PostsForm/'
import keys from '../config/keys'


const PostsEdit = props => (
  <PostsForm
    pageTitle="Edit Post"
    post={props.post}
    apiEndpoint={`/api/posts/${props.post._id}`}
    editing
  />
)


PostsEdit.getInitialProps = async context => {

  const { id } = context.query
  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const post = await axios.get(`${rootUrl}/api/posts/${id}`)

  return { post: post.data }
}


const mapStateToProps = state => {
  return { post: state.post }
}


export default connect(mapStateToProps)(PostsEdit)
