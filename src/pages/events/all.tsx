import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment-timezone'
import userContext from '../../context/userContext'
import keys from '../../config/keys'
import { SectionCards } from '../../components/Sections/'

const EventsAllPage = props => {

  const { currentUser } = useContext(userContext)
  const [events, setEvents] = useState(props.events || [])

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      const getEvents = async () => {
        const { data: events } = await axios.get('/api/events')
        setEvents(events)
      }
      getEvents()
    }
  }, [])


  const renderDate = post => (
    <p>{moment(post.date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
  )


  return <SectionCards
    posts={events}
    title="Events"
    perRow={4}
    readMore
    path="events"
    contentLength={200}
    emptyMessage="There are no events coming up."
    afterPostTitle={renderDate}
  />
}


EventsAllPage.getInitialProps = async () => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const { data: events } = await axios.get(`${rootUrl}/api/events/published`)

  return { events }
}


export default EventsAllPage
