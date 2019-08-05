import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import moment from 'moment-timezone'
import PostsForm from '../components/PostsForm'
import keys from '../config/keys'
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


EventsEdit.getInitialProps = async ({ query, req }) => {

  let axiosConfig

  // Depending on if we are doing a client or server render
  if (!!req) {
    axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie
      }
    }
  }

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const event = await axios.get(`${rootUrl}/api/events/${query.id}`, axiosConfig)

  return { event: event.data }
}


const mapStateToProps = state => {
  return { event: state.event }
}


export default connect(mapStateToProps)(EventsEdit)
