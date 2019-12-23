import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import moment from 'moment-timezone'
import PostsForm from '../../components/PostsForm'
import keys from '../../config/keys'
import Input from '../../components/Input'


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
  <div className="u-form-row">
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


const EventsEdit = props => (
  <PostsForm
    pageTitle="Edit Event"
    post={props.event}
    apiEndpoint={`/api/events/${props.event._id}`}
    redirectRoute="/events/all"
    editing
    additionalFields={[coordinatesField, dateField]}
    additionalState={{
      date: moment(props.event.date).tz('America/Chicago').format("YYYY-MM-DD"),
      latitude: props.event.latitude,
      longitude: props.event.longitude,
    }}
  />
)


EventsEdit.getInitialProps = async context => {

  let { id, event } = context.query

  if (!event) {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const res = await axios.get(`${rootUrl}/api/events/${id}`)
    event = res.data
  }

  return { event }
}


const mapStateToProps = state => {
  return { event: state.event }
}


export default connect(mapStateToProps)(EventsEdit)
