import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../config/keys'
import PostShow from '../components/PostShow/'

const PostsShow = props => (
  <PostShow
    currentUser={props.currentUser}
    post={props.post}
    settings={props.settings}
    enableCommenting={false}
    path="posts"
  />
)


PostsShow.getInitialProps = async context => {

  const { id } = context.query
  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const post = await axios.get(`${rootUrl}/api/posts/${id}`)

  return { post: post.data }
}


const mapStateToProps = state => {
  const { currentUser, post, settings } = state

  return { currentUser, post, settings }
}


export default connect(mapStateToProps)(PostsShow)
