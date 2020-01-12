import React from 'react'
import axios from 'axios'
import moment from 'moment-timezone'
import { connect } from 'react-redux'
import keys from '../../../config/keys'
import Map from '../../../components/Map'
import { PostShow } from '../../../components/Sections/'


const EventsShow = props => {

  const renderMap = () => (
    <Map
      className="u-padding-top-medium"
      latitude={props.event.latitude}
      longitude={props.event.longitude}
      zoom={16}
    />
  )

  const renderDate = () => (
    <p>{moment(props.event.date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
  )

  return <PostShow
    post={props.event}
    path="events"
    apiPath="/api/events"
    redirectRoute="/events/all"
    afterPost={renderMap}
    afterTitle={renderDate}
  />
}


EventsShow.getInitialProps = async ({ query, req }) => {

  // Depending on if we are doing a client or server render
  let axiosConfig = {}
  if (!!req) {
    axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie || ''
      }
    }
  }

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const { data: event } = await axios.get(`${rootUrl}/api/events/${query.id}`, axiosConfig)
  const { data: googleMapsKey } = await axios.post('/api/googleMapsKey')

  return { event, googleMapsKey }
}


const mapStateToProps = state => {
  return { event: state.event }
}


export default connect(mapStateToProps)(EventsShow)
