import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import moment from 'moment'
import userContext from '../../../context/userContext'
import PostsForm from '../../../components/PostsForm'
import keys from '../../../config/keys'
import Input from '../../../components/Input'


const dateField = ({ values, handleChange }) => (
  <Input
    label="Date"
    type="date"
    name="date"
    value={values['date'] || ''}
    onChange={handleChange}
  />
)

const coordinatesField = ({ values, handleChange }) => (
  <div className="u-form-row">
    <Input
      id="event_latitude"
      label="Latitude"
      name="latitude"
      value={values['latitude'] || ''}
      onChange={handleChange}
    />

    <Input
      id="event_longitude"
      label="Longitude"
      name="longitude"
      value={values['longitude'] || ''}
      onChange={handleChange}
    />
  </div>
)


const EventsEdit = props => {

  const { currentUser } = useContext(userContext)
  const [event, setEvent] = useState(props.event || {})
  const { query } = useRouter()

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      const getEvent = async () => {
        const { data: event } = await axios.get(`/api/events/${query.id}`)
        setEvent(event)
      }
      getEvent()
    }
  }, [])

  return (
    <PostsForm
      pageTitle="Edit Event"
      post={event}
      apiEndpoint={`/api/events/${event._id}`}
      redirectRoute="/events/all"
      editing
      additionalFields={[coordinatesField, dateField]}
      additionalState={{
        date: moment(event.date).format("YYYY-MM-DD"),
        latitude: event.latitude,
        longitude: event.longitude,
      }}
    />
  )
}


EventsEdit.getInitialProps = async ({ query }) => {
  try {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const { data: event } = await axios.get(`${rootUrl}/api/events/${query.id}`)

    return { event }
  } catch (err) {
    return {}
  }
}


export default EventsEdit
