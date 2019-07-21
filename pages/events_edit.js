import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import moment from 'moment-timezone'
import PostsForm from '../components/PostsForm'
import keys from '../config/keys'


const dateField = props => { return (
  <div className="post-form__field">
    <label className="post-form__label">Date</label>
    <input
      className="post-form__input"
      type="date"
      name="date"
      value={props.date}
      onChange={event => props.changeState(event.target.value, 'date')}
    />
  </div>
)
}

const coordinatesField = props => (
  <div className="post-form__top">
    <div className="post-form__field">
      <label className="post-form__label">Latitude</label>
      <input
        className="post-form__input"
        type="text"
        name="latitude"
        value={props.latitude}
        onChange={event => props.changeState(event.target.value, 'latitude')}
      />
    </div>

    <div className="post-form__field">
      <label className="post-form__label">Longitude</label>
      <input
        className="post-form__input"
        type="text"
        name="longitude"
        value={props.longitude}
        onChange={event => props.changeState(event.target.value, 'longitude')}
      />
    </div>
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
