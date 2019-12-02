import React, { Fragment } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import keys from '../../config/keys'
import PostShow from '../../components/PostShow/'

const Position = () => <div className="section-maps__position" />

const Map = props => {

  const { googleMapsKey, event } = props
  const { latitude, longitude } = event

  if (latitude && longitude) {

    return (
      <div className="section-maps__map">
        <GoogleMapReact
          bootstrapURLKeys={{ key: googleMapsKey }}
          defaultCenter={{ lat: latitude, lng: longitude }}
          defaultZoom={16}
        >
          <Position
            lat={latitude}
            lng={longitude}
          />
        </GoogleMapReact>
      </div>
    )
  } else {
    return null
  }
}


const EventsShow = props => (
  <Fragment>
    <PostShow
      post={props.event}
      path="events"
      apiPath="/api/events"
      redirectRoute="/events/all"
    />
    <Map
      event={props.event}
      googleMapsKey={props.googleMapsKey}
    />
  </Fragment>
)


EventsShow.getInitialProps = async context => {

  let { id, event } = context.query

  if (!event) {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const res = await axios.get(`${rootUrl}/api/events/${id}`)
    event = res.data
  }

  let googleMapsKey = ''
  if (!!context.res) {
    googleMapsKey = context.query.googleMapsKey
  } else {
    const response = await axios.post('/api/googleMapsKey')
    googleMapsKey = response.data
  }

  return { event, googleMapsKey }
}


const mapStateToProps = state => {
  return { event: state.event, googleMapsKey: state.googleMapsKey }
}


export default connect(mapStateToProps)(EventsShow)
