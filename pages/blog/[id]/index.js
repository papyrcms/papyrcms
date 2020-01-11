import React from 'react'
import axios from 'axios'
import moment from 'moment-timezone'
import { connect } from 'react-redux'
import keys from '../../../config/keys'
import { PostShow } from '../../../components/Sections/'

const BlogShow = props => {

  const renderDate = () => {

    const date = props.blog.published && props.blog.publishDate
      ? props.blog.publishDate
      : props.blog.created

    return <p>{moment(date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
  }

  return <PostShow
    post={props.blog}
    enableCommenting={true}
    path="blog"
    apiPath="/api/blogs"
    redirectRoute="/blog/all"
    afterTitle={renderDate}
  />
}


BlogShow.getInitialProps = async ({ req, query }) => {

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
  const res = await axios.get(`${rootUrl}/api/blogs/${query.id}`, axiosConfig)

  return { blog: res.data }
}


const mapStateToProps = state => {
  return { blog: state.blog }
}


export default connect(mapStateToProps)(BlogShow)
