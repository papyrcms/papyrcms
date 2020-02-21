import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import moment from 'moment-timezone'
import userContext from '../../../context/userContext'
import keys from '../../../config/keys'
import Map from '../../../components/Map'
import { PostShow } from '../../../components/Sections/'


const EventsShow = props => {

  const { currentUser } = useContext(userContext)
  const [event, setEvent] = useState(props.event || {})
  const { query } = useRouter()

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      console.log(query.id, 'nice')
      const getEvent = async () => {
        const { data: event } = await axios.get(`/api/events/${query.id}`)
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
    <p>{moment(event.date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
  )

  return <PostShow
    post={event}
    path="events"
    apiPath="/api/events"
    redirectRoute="/events/all"
    afterPost={renderMap}
    afterTitle={renderDate}
  />
}


EventsShow.getInitialProps = async ({ query }) => {
  try {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const { data: event } = await axios.get(`${rootUrl}/api/events/${query.id}`)
    const { data: googleMapsKey } = await axios.post(`${rootUrl}/api/utility/googleMapsKey`)

    return { event, googleMapsKey }
  } catch (err) {
    return {}
  }
}


export default EventsShow
