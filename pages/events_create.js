import React from 'react'
import PostsForm from '../components/PostsForm/'

const dateField = props => (
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


export default () => (
  <PostsForm
    pageTitle="New Event"
    apiEndpoint="/api/events"
    redirectRoute="/events/all"
    additionalFields={[coordinatesField, dateField]}
    additionalState={{
      date: null,
      latitude: 0,
      longitude: 0,
    }}
  />
)
