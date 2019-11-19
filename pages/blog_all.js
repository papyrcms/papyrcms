import React from 'react'
import axios from 'axios'
import keys from '../config/keys'
import { SectionCards } from '../components/Sections/'
import filterPosts from '../components/filterPosts'


const BlogAllPage = props => (
  <SectionCards
    title="Blog"
    perRow={4}
    path="blog"
    contentLength={100}
    emptyMessage="There are no blogs yet."
    readMore
    showDate
    posts={props.posts}
  />
)


BlogAllPage.getInitialProps = async ({ req, query, reduxStore }) => {

  let currentUser
  let axiosConfig = {}

  // Depending on if we are doing a client or server render
  if (!!req) {
    currentUser = query.currentUser
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
  const blogRequest = currentUser && currentUser.isAdmin ? 'blogs' : 'published_blogs'
  const blogs = await axios.get(`${rootUrl}/api/${blogRequest}`, axiosConfig)

  return { blogs: blogs.data }
}


const settings = {
  postType: 'blogs'
}


export default filterPosts(BlogAllPage, settings)
