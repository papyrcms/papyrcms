import { Event } from 'types'
import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import { postsContext, eventsContext } from '@/context'
import { SectionStrip } from '@/sections'
import { PageHead } from '@/components'
import { usePostFilter } from '@/hooks'
import styles from './events.module.scss'

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
    <div className={styles.events}>
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
    </div>
  )
}

export default EventsPage
