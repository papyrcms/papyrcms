import React from 'react'
import axios from 'axios'
import moment from 'moment-timezone'
import keys from '../../config/keys'
import filterPosts from '../../components/filterPosts'
import { SectionCards } from '../../components/Sections/'

const EventsAllPage = props => {


  const renderDate = (sectionProps, post) => (
    <p>{moment(post.date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
  )


  return <SectionCards
    posts={props.posts}
    title="Events"
    perRow={4}
    readMore
    path="events"
    contentLength={200}
    emptyMessage="There are no events coming up."
    afterPostTitle={renderDate}
  />
}


EventsAllPage.getInitialProps = async ({ req, reduxStore }) => {

  let currentUser
  let axiosConfig = {}

  // Depending on if we are doing a client or server render
  if (!!req) {
    currentUser = req.user
    axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie || ''
      }
    }
  } else {
    currentUser = reduxStore.getState().currentUser
  }

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const published = currentUser && currentUser.isAdmin ? '' : '/published'
  const res = await axios.get(`${rootUrl}/api/events${published}`, axiosConfig)

  return { events: res.data }
}


const settings = {
  postType: 'events'
}


export default filterPosts(EventsAllPage, settings)
