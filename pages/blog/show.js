import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../../config/keys'
import { PostShow } from '../../components/Sections/'

const BlogShow = props => (
  <PostShow
    post={props.blog}
    enableCommenting={true}
    path="blog"
    apiPath="/api/blogs"
    redirectRoute="/blog/all"
    showDate
  />
)


BlogShow.getInitialProps = async context => {

  let { id, blog } = context.query

  if (!blog) {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const res = await axios.get(`${rootUrl}/api/blogs/${id}`)
    blog = res.data
  }

  return { blog }
}


const mapStateToProps = state => {
  return { blog: state.blog }
}


export default connect(mapStateToProps)(BlogShow)
