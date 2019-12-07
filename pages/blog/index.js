import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import keys from '../../config/keys'
import filterPosts from '../../components/filterPosts'
import { SectionStandard } from '../../components/Sections/'


const BlogPage = ({ posts }) => {


  const renderAllBlogsLink = () => {
    if (posts.length > 5) {
      return (
        <Link href="/blog/all">
          <a className="blog-page__button button button-secondary u-margin-bottom-small">See all blog posts</a>
        </Link>
      )
    }
  }


  return (
    <div className="blog-page">

      <SectionStandard
        posts={posts}
        title="Blog"
        mediaLeft
        readMore
        path="blog"
        emptyMessage="There are no blogs yet."
        showDate="publishDate"
      />

      {renderAllBlogsLink()}
    </div>
  )
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
