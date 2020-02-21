import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import moment from 'moment-timezone'
import userContext from '../../../context/userContext'
import keys from '../../../config/keys'
import { PostShow } from '../../../components/Sections/'

const BlogShow = props => {

  const { currentUser } = useContext(userContext)
  const [blog, setBlog] = useState(props.blog || {})
  const { query } = useRouter()

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      const getBlog = async () => {
        const { data: blog } = await axios.get(`/api/blogs/${query.id}`)
        setBlog(blog)
      }
      getBlog()
    }
  }, [])

  const renderDate = () => {

    const date = blog.published && blog.publishDate
      ? blog.publishDate
      : blog.created

    return <p>{moment(date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
  }

  return <PostShow
    post={blog}
    enableCommenting={true}
    path="blog"
    apiPath="/api/blogs"
    redirectRoute="/blog/all"
    afterTitle={renderDate}
  />
}


BlogShow.getInitialProps = async ({ query }) => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const { data: blog } = await axios.get(`${rootUrl}/api/blogs/${query.id}`)

  return { blog }
}


export default BlogShow
