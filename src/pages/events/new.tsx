import Error from 'next/error'
import { useUser } from '@/context'
import { PostsForm, Input } from '@/components'

interface Props {
  values: Record<string, any>
  errors: Record<string, any>
  validateField: Function
  handleChange: Function
}

const dateField: React.FC<Props> = ({
  values,
  errors,
  handleChange,
  validateField,
}) => (
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

const coordinatesField: React.FC<Props> = ({
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

const EventNew = () => {
  const { currentUser } = useUser()
  if (!currentUser?.isAdmin) return <Error statusCode={403} />

  return (
    <PostsForm
      pageTitle="New Event"
      apiEndpoint="/api/events"
      redirectRoute="/events/all"
      additionalFields={[coordinatesField, dateField]}
      additionalState={{
        date: null,
        latitude: null,
        longitude: null,
      }}
    />
  )
}

export default EventNew
