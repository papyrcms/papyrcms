import { Event } from 'types'
import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import moment from 'moment'
import userContext from '@/context/userContext'
import keys from '@/keys'
import { Map } from '@/components'
import { SectionStandard } from '@/Sections'

const EventsShow = (props: { event: Event }) => {
  const { currentUser } = useContext(userContext)
  const [event, setEvent] = useState(props.event || {})
  const { query } = useRouter()

  useEffect(() => {
    if (currentUser?.isAdmin) {
      const getEvent = async () => {
        const { data: event } = await axios.get(
          `/api/events/${query.id}`
        )
        setEvent(event)
      }
      getEvent()
    }
  }, [currentUser])

  const renderMap = () => (
    <Map
      className="u-padding-top-medium"
      latitude={event.latitude}
      longitude={event.longitude}
      zoom={16}
    />
  )

  const renderDate = () => (
    <p>{moment(event.date).format('MMMM Do, YYYY')}</p>
  )

  return (
    <SectionStandard
      posts={[event]}
      path="events"
      apiPath="/api/events"
      redirectRoute="/events/all"
      afterPost={renderMap}
      afterTitle={renderDate}
    />
  )
}

EventsShow.getInitialProps = async ({
  query,
}: {
  query: { id: string }
}) => {
  try {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const { data: event } = await axios.get(
      `${rootUrl}/api/events/${query.id}`
    )

    return { event }
  } catch (err) {
    return {}
  }
}

export default EventsShow
