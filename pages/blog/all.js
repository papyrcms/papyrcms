import React from 'react'
import axios from 'axios'
import moment from 'moment-timezone'
import keys from '../../config/keys'
import { SectionCards } from '../../components/Sections/'
import filterPosts from '../../components/filterPosts'


const BlogAllPage = props => {

  const renderDate = (sectionProps, post) => {

    const date = post.published && post.publishDate
      ? post.publishDate
      : post.created

    return <p>{moment(date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
  }

  return <SectionCards
    title="Blog"
    perRow={4}
    path="blog"
    contentLength={100}
    emptyMessage="There are no blogs yet."
    readMore
    posts={props.posts}
    afterPostTitle={renderDate}
  />
}


BlogAllPage.getInitialProps = async ({ req, reduxStore }) => {

  let currentUser
  let axiosConfig = {}

  // Depending on if we are doing a client or server render
  if (!!req) {
    currentUser = req.user
    axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie
      }
    }
  } else {
    currentUser = reduxStore.getState().currentUser
  }

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const blogRequest = currentUser && currentUser.isAdmin ? 'blogs' : 'publishedBlogs'
  const blogs = await axios.get(`${rootUrl}/api/${blogRequest}`, axiosConfig)

  return { blogs: blogs.data }
}


const settings = {
  postType: 'blogs'
}


export default filterPosts(BlogAllPage, settings)
