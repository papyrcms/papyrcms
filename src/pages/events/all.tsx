import { Event } from 'types'
import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import userContext from '@/context/userContext'
import eventsContext from '@/context/eventsContext'
import SectionCards from '@/components/Sections/SectionCards'

const EventsAllPage = () => {
  const { currentUser } = useContext(userContext)
  const { events, setEvents } = useContext(eventsContext)

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      const getEvents = async () => {
        const { data: events } = await axios.get('/api/events')
        setEvents(events)
      }
      getEvents()
    } else if (events.length === 0) {
      const fetchEvents = async () => {
        const { data: foundEvents } = await axios.get(
          '/api/events/published'
        )
        setEvents(foundEvents)
      }
      fetchEvents()
    }
  }, [events, currentUser])

  const renderDate = (post: Event) => (
    <p>{moment(post.date).format('MMMM Do, YYYY')}</p>
  )

  return (
    <SectionCards
      posts={events}
      title="Events"
      perRow={4}
      readMore
      path="events"
      contentLength={200}
      emptyMessage="There are no events coming up."
      afterPostTitle={renderDate}
    />
  )
}

export default EventsAllPage
