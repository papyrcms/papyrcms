import React, { Fragment } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import keys from '../config/keys'
import PostShow from '../components/PostShow/'

const Position = () => <div className="section-maps__position" />

const EventsShow = props => (
  <Fragment>
    <PostShow
      post={props.event}
      path="events"
      apiPath="/api/events"
      redirectRoute="/events/all"
    />
    <div className="section-maps__map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: props.googleMapsKey }}
        defaultCenter={{ lat: props.event.latitude, lng: props.event.longitude }}
        defaultZoom={16}
      >
        <Position
          lat={props.event.latitude}
          lng={props.event.longitude}
        />
      </GoogleMapReact>
    </div>
  </Fragment>
)


EventsShow.getInitialProps = async context => {

  const { id } = context.query
  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const event = await axios.get(`${rootUrl}/api/events/${id}`)

  let googleMapsKey = ''
  if (!!context.res) {
    googleMapsKey = context.query.googleMapsKey
  } else {
    const response = await axios.post('/api/googleMapsKey')
    googleMapsKey = response.data
  }

  return { event: event.data, googleMapsKey }
}


const mapStateToProps = state => {

  return { event: state.event, googleMapsKey: state.googleMapsKey }
}


export default connect(mapStateToProps)(EventsShow)
