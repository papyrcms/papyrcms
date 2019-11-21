import React from 'react'
import axios from 'axios'
import keys from '../config/keys'
import filterPosts from '../components/filterPosts'
import { SectionStandard } from '../components/Sections/'

const EventsPage = props => (
  <div className="events-page">
    <SectionStandard
      posts={props.posts}
      title="Events"
      mediaLeft
      readMore
      path="events"
      emptyMessage="There are no events coming up."
      showDate="date"
    />
  </div>
)


EventsPage.getInitialProps = async () => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const events = await axios.get(`${rootUrl}/api/published_events`)

  return { events: events.data }
}


const settings = {
  postType: 'events'
}


export default filterPosts(EventsPage, settings)
