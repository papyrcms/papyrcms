import React from 'react'
import axios from 'axios'
import keys from '../config/keys'
import filterPosts from '../components/filterPosts'
import { SectionCards } from '../components/Sections/'

const EventsAllPage = props => (
  <SectionCards
    posts={props.posts}
    title="Events"
    perRow={4}
    readMore
    path="events"
    contentLength={200}
    emptyMessage="There are no events coming up."
  />
)


EventsAllPage.getInitialProps = async ({ req, query, reduxStore }) => {

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
  const eventRequest = currentUser && currentUser.isAdmin ? 'events' : 'published_events'
  const events = await axios.get(`${rootUrl}/api/${eventRequest}`, axiosConfig)

  return { events: events.data }
}


const settings = {
  postType: 'events'
}


export default filterPosts(EventsAllPage, settings)
