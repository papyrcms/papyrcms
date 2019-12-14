import React from 'react'
import PostsForm from '../../components/PostsForm/'
import Input from '../../components/Input'

const dateField = ({ values, errors, handleChange, validateField }) => (
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

const coordinatesField = ({ values, errors, handleChange, validateField }) => (
  <div className="post-form__top">
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
