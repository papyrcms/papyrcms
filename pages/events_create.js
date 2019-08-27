import React from 'react'
import PostsForm from '../components/PostsForm/'
import Input from '../components/Input'

const dateField = ({ date, changeState }) => (
  <Input
    id="event_date"
    label="Date"
    type="date"
    name="date"
    value={date || ''}
    onChange={event => changeState(event.target.value, 'date')}
  />
)

const coordinatesField = ({ latitude, longitude, changeState }) => (
  <div className="post-form__top">
    <Input
      id="event_latitude"
      label="Latitude"
      name="latitude"
      value={latitude || ''}
      onChange={event => changeState(event.target.value, 'latitude')}
    />

    <Input
      id="event_longitude"
      label="Longitude"
      name="longitude"
      value={longitude || ''}
      onChange={event => changeState(event.target.value, 'longitude')}
    />
  </div>
)


export default () => (
  <PostsForm
    pageTitle="New Event"
    apiEndpoint="/api/events"
    redirectRoute="/events/all"
    additionalFields={[coordinatesField, dateField]}
    additionalState={{
      date: null,
      latitude: null,
      longitude: null
    }}
  />
)
