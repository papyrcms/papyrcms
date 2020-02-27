import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import userContext from '../../context/userContext'
import keys from '../../config/keys'
import { SectionCards } from '../../components/Sections/'


const BlogAllPage = props => {

  const { currentUser } = useContext(userContext)
  const [blogs, setBlogs] = useState(props.blogs || [])

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      const getBlogs = async () => {
        const { data: blogs } = await axios.get('/api/blogs')
        setBlogs(blogs)
      }
      getBlogs()
    }
  }, [])

  const renderDate = post => {
    const date = post.published && post.publishDate
      ? post.publishDate
      : post.created

    return <p>{moment(date).format('MMMM Do, YYYY')}</p>
  }

  return <SectionCards
    title="Blog"
    perRow={4}
    path="blog"
    contentLength={100}
    emptyMessage="There are no blogs yet."
    readMore
    posts={blogs}
    afterPostTitle={renderDate}
  />
}


BlogAllPage.getInitialProps = async () => {
  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const { data: blogs } = await axios.get(`${rootUrl}/api/blogs/published`)

  return { blogs }
}


export default BlogAllPage
