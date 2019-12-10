import React from 'react'
import axios from 'axios'
import moment from 'moment-timezone'
import Link from 'next/link'
import keys from '../../config/keys'
import filterPosts from '../../components/filterPosts'
import { SectionStandard } from '../../components/Sections/'


const BlogPage = ({ posts }) => {


  const renderAllBlogsLink = () => {
    if (posts.length === 5) {
      return (
        <Link href="/blog/all">
          <button className="button button-secondary">See all blog posts</button>
        </Link>
      )
    }
  }


  const renderDate = post => {

    const date = post.published && post.publishDate
      ? post.publishDate
      : post.created

    return <p>{moment(date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
  }


  return <SectionStandard
    posts={posts}
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
  const blogs = await axios.get(`${rootUrl}/api/publishedBlogs`)

  return { blogs: blogs.data }
}


const settings = {
  postType: 'blogs',
  maxPosts: 5
}


export default filterPosts(BlogPage, settings)
