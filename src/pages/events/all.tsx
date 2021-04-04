import { Event } from 'types'
import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import { userContext, eventsContext, postsContext } from '@/context'
import { PageHead } from '@/components'
import { SectionCards } from '@/sections'
import { usePostFilter } from '@/hooks'

const EventsAllPage = () => {
  const { currentUser } = useContext(userContext)
  const { events, setEvents } = useContext(eventsContext)

  useEffect(() => {
    if (currentUser?.isAdmin) {
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
    </>
  )
}

export default EventsAllPage
