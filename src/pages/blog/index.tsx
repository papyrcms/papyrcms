import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import keys from '../../config/keys'
import filterPosts from '../../hooks/filterPosts'
import { SectionStrip } from '../../components/Sections/'

type Props = {
  blogs: Array<Blog>
}

const BlogPage = (props: Props) => {

  const [blogs, setBlogs] = useState(props.blogs)

  useEffect(() => {
    const settings = {
      maxPosts: 5
    }
    const { posts: filteredBlogs } = filterPosts(blogs, settings)
    setBlogs(filteredBlogs)
  }, [])

  const renderAllBlogsLink = () => {
    if (blogs.length === 5) {
      return (
        <Link href="/blog/all">
          <button className="button button-secondary">See all blog posts</button>
        </Link>
      )
    }
  }


  const renderDate = (post: Blog) => {

    const date = post.published && post.publishDate
      ? post.publishDate
      : post.created

    return <p>{moment(date).format('MMMM Do, YYYY')}</p>
  }


  return <SectionStrip
    posts={blogs}
    title="Blog"
    mediaLeft
    readMore
    path="blog"
    emptyMessage="There are no blogs yet."
    beforePostContent={renderDate}
    afterPosts={renderAllBlogsLink}
  />
}


BlogPage.getInitialProps = async () => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const { data: blogs } = await axios.get(`${rootUrl}/api/blogs/published`)

  return { blogs }
}


export default BlogPage
