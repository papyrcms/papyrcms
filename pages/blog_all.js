import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../config/keys'
import PostsFilter from '../components/PostsFilter'
import { SectionCards } from '../components/Sections/'

const BlogAllPage = props => (
  <PostsFilter
    component={SectionCards}
    posts={props.blogs}
    settings={{
      maxPosts: "9999"
    }}
    componentProps={{
      title: 'Blog',
      perRow: 4,
      readMore: true,
      path: 'blog',
      contentLength: 200,
      emptyMessage: 'There are no blogs yet.',
      showDate: true
    }}
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


const mapStateToProps = state => {
  return { blogs: state.blogs, settings: state.settings }
}


export default connect(mapStateToProps)(BlogAllPage)
