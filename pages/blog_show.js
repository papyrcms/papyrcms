import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../config/keys'
import PostShow from '../components/PostShow/'

const BlogShow = props => (
  <PostShow
    currentUser={props.currentUser}
    post={props.blog}
    settings={props.settings}
    enableCommenting={true}
    path="blog"
    apiPath="/api/blogs"
    redirectRoute="/blog/all"
  />
)


BlogShow.getInitialProps = async context => {

  const { id } = context.query
  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const blog = await axios.get(`${rootUrl}/api/blogs/${id}`)

  return { blog: blog.data }
}


const mapStateToProps = state => {

  const { currentUser, blog, settings } = state

  return { currentUser, blog, settings }
}


export default connect(mapStateToProps)(BlogShow)
