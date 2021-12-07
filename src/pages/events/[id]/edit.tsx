import { Event } from '@/types'
import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Error from 'next/error'
import axios from 'axios'
import moment from 'moment'
import { userContext } from '@/context'
import { PostsForm, Input } from '@/components'
import keys from '@/keys'

type Props = {
  values: any
  errors: any
  validateField: Function
  handleChange: Function
}

const dateField = ({
  values,
  errors,
  handleChange,
  validateField,
}: Props) => (
  <Input
    id="event_date"
    label="Date"
    type="date"
    name="date"
    value={values.date || ''}
    validation={errors.date}
    onBlur={validateField}
    onChange={handleChange}
    required
  />
)

const coordinatesField = ({
  values,
  errors,
  handleChange,
  validateField,
}: Props) => (
  <div className="u-form-row">
    <Input
      id="event_latitude"
      label="Latitude"
      name="latitude"
      value={values.latitude || ''}
      validation={errors.latitude}
      onBlur={validateField}
      onChange={handleChange}
    />

    <Input
      id="event_longitude"
      label="Longitude"
      name="longitude"
      value={values.longitude || ''}
      validation={errors.longitude}
      onBlur={validateField}
      onChange={handleChange}
    />
  </div>
)

const EventsEdit = (props: { event: Event }) => {
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
  }, [])

  if (!currentUser?.isAdmin) return <Error statusCode={403} />

  return (
    <PostsForm
      pageTitle="Edit Event"
      post={event}
      apiEndpoint={`/api/events/${event.id}`}
      redirectRoute="/events/all"
      editing
      additionalFields={[coordinatesField, dateField]}
      additionalState={{
        date: moment(event.date).format('YYYY-MM-DD'),
        latitude: event.latitude,
        longitude: event.longitude,
      }}
    />
  )
}

EventsEdit.getInitialProps = async ({
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
  } catch (err: any) {
    return {}
  }
}

export default EventsEdit
