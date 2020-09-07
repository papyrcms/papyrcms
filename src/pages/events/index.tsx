import { Event } from 'types'
import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import eventsContext from '@/context/eventsContext'
import SectionStrip from '@/components/Sections/SectionStrip'

const EventsPage = () => {
  const { events, setEvents } = useContext(eventsContext)

  useEffect(() => {
    const fetchEvents = async () => {
      if (events.length === 0) {
        const { data: foundEvents } = await axios.get(
          '/api/events/published'
        )
        setEvents(foundEvents)
      }
    }
    fetchEvents()
  }, [])

  const renderDate = (event: Event) => (
    <p>{moment(event.date).format('MMMM Do, YYYY')}</p>
  )

  return (
    <SectionStrip
      posts={events}
      title="Events"
      mediaLeft
      readMore
      path="events"
      emptyMessage="There are no events coming up."
      beforePostContent={renderDate}
    />
  )
}

export default EventsPage
