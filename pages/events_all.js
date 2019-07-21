import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../config/keys'
import PostsFilter from '../components/PostsFilter'
import { SectionCards } from '../components/Sections/'

const EventsAllPage = props => (
  <PostsFilter
    component={SectionCards}
    posts={props.events}
    settings={{
      maxPosts: "9999"
    }}
    componentProps={{
      title: 'Events',
      perRow: 4,
      readMore: true,
      path: 'events',
      contentLength: 200,
      emptyMessage: 'There are no events coming up.',
    }}
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


const mapStateToProps = state => {
  return { events: state.events, settings: state.settings }
}


export default connect(mapStateToProps)(EventsAllPage)
