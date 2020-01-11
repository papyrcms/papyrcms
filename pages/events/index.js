import React from 'react'
import axios from 'axios'
import moment from 'moment-timezone'
import keys from '../../config/keys'
import filterPosts from '../../components/filterPosts'
import { SectionStandard } from '../../components/Sections/'

const EventsPage = props => {


  const renderDate = post => (
    <p>{moment(post.date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
  )


  return <SectionStandard
    posts={props.posts}
    title="Events"
    mediaLeft
    readMore
    path="events"
    emptyMessage="There are no events coming up."
    beforePostContent={renderDate}
  />
}


EventsPage.getInitialProps = async () => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const events = await axios.get(`${rootUrl}/api/events/published`)

  return { events: events.data }
}


const settings = {
  postType: 'events'
}


export default filterPosts(EventsPage, settings)
