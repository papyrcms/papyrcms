import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../../config/keys'
import { PostShow } from '../../components/Sections/'

const PostsShow = props => (
  <PostShow
    post={props.post}
    enableCommenting={false}
    path="posts"
  />
)


PostsShow.getInitialProps = async context => {

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


export default connect(mapStateToProps)(PostsShow)
