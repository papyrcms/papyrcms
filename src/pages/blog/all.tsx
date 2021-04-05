import { Blog } from 'types'
import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import { PageHead } from '@/components'
import { userContext, blogsContext, postsContext } from '@/context'
import { SectionCards } from '@/components'
import { usePostFilter } from '@/hooks'

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

  const { posts } = useContext(postsContext)

  let headTitle = 'Blog'
  const headerSettings = {
    maxPosts: 1,
    postTags: ['section-header'],
  }
  const {
    posts: [headerPost],
  } = usePostFilter(posts, headerSettings)
  if (headerPost) {
    headTitle = `${headerPost.title} | ${headTitle}`
  }

  return (
    <>
      <PageHead title={headTitle} />
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
    </>
  )
}

export default BlogAllPage
