import { Blog } from 'types'
import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import userContext from '@/context/userContext'
import blogsContext from '@/context/blogsContext'
import SectionCards from '@/components/Sections/SectionCards'

const BlogAllPage = () => {
  const { currentUser } = useContext(userContext)
  const { blogs, setBlogs } = useContext(blogsContext)

  useEffect(() => {
    if (currentUser?.isAdmin) {
      const getBlogs = async () => {
        const { data: blogs } = await axios.get('/api/blogs')
        setBlogs(blogs)
      }
      getBlogs()
    } else if (blogs.length === 0) {
      const fetchBlogs = async () => {
        const { data: foundBlogs } = await axios.get(
          '/api/blogs/published'
        )
        setBlogs(foundBlogs)
      }
      fetchBlogs()
    }
  }, [currentUser, blogs])

  const renderDate = (post: Blog) => {
    const date =
      post.published && post.publishDate
        ? post.publishDate
        : post.created

    return <p>{moment(date).format('MMMM Do, YYYY')}</p>
  }

  return (
    <SectionCards
      title="Blog"
      perRow={4}
      path="blog"
      contentLength={100}
      emptyMessage="There are no blogs yet."
      readMore
      posts={blogs}
      afterPostTitle={renderDate}
    />
  )
}

export default BlogAllPage
