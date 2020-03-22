import React, { useContext } from 'react'
import userContext from '../../context/userContext'
import PostsForm from '../../components/PostsForm/'
import Input from '../../components/Input'

type FieldProps = {
  values: any,
  errors: any,
  handleChange: Function,
  validateField: Function
}

const dateField = ({ values, errors, handleChange, validateField }: FieldProps) => (
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

const coordinatesField = ({ values, errors, handleChange, validateField }: FieldProps) => (
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


export default () => {

  const { currentUser } = useContext(userContext)
  if (!currentUser || !currentUser.isAdmin) return null

  return (
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
}
