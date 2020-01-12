import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../../../config/keys'
import { PostShow } from '../../../components/Sections/'

const PostsShow = props => (
  <PostShow
    post={props.post}
    enableCommenting={false}
    path="posts"
  />
)


PostsShow.getInitialProps = async ({ query, req }) => {

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


export default connect(mapStateToProps)(PostsShow)
