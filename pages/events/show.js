import React from 'react'
import axios from 'axios'
import moment from 'moment-timezone'
import { connect } from 'react-redux'
import keys from '../../config/keys'
import Map from '../../components/Map'
import { PostShow } from '../../components/Sections/'


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
  return { event: state.event }
}


export default connect(mapStateToProps)(EventsShow)
