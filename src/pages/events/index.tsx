import { Event } from 'types'
import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import postsContext from '@/context/postsContext'
import eventsContext from '@/context/eventsContext'
import { SectionStrip } from '@/Sections'
import { PageHead } from '@/components'
import { usePostFilter } from '@/hooks'

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

  const { posts } = useContext(postsContext)

  let headTitle = 'Events'
  const headerSettings = {
    maxPosts: 1,
    postTags: ['section-header'],
  }
  const {
    posts: [headerPost],
  } = usePostFilter(posts, headerSettings)
  if (headerPost) {
    headTitle = `${headerPost.title} | ${headTitle}`
  }

  return (
    <>
      <PageHead title={headTitle} />
      <SectionStrip
        posts={events}
        title="Events"
        mediaLeft
        readMore
        path="events"
        emptyMessage="There are no events coming up."
        beforePostContent={renderDate}
      />
    </>
  )
}

export default EventsPage
