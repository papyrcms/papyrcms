import React, { useEffect } from 'react'
import axios from 'axios'
import moment from 'moment-timezone'
import { connect } from 'react-redux'
import keys from '../../config/keys'
import { setBlogs } from '../../reduxStore'
import { SectionCards } from '../../components/Sections/'
import filterPosts from '../../components/filterPosts'


const BlogAllPage = props => {

  const { currentUser, posts } = props

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

    return <p>{moment(date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
  }

  return <SectionCards
    title="Blog"
    perRow={4}
    path="blog"
    contentLength={100}
    emptyMessage="There are no blogs yet."
    readMore
    posts={posts}
    afterPostTitle={renderDate}
  />
}


BlogAllPage.getInitialProps = async () => {
  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const { data: blogs } = await axios.get(`${rootUrl}/api/blogs/published`)

  return { blogs }
}


const settings = {
  postType: 'blogs'
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default connect(mapStateToProps, { setBlogs })(filterPosts(BlogAllPage, settings))
