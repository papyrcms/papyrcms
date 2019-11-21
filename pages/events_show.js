import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import keys from '../config/keys'
import PostShow from '../components/PostShow/'

const Position = () => <div className="section-maps__position" />

class EventsShow extends Component {

  static async getInitialProps(context) {

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


  renderMap() {

    const { googleMapsKey, event } = this.props
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
    }
  }


  render() {

    return (
      <Fragment>
        <PostShow
          post={this.props.event}
          path="events"
          apiPath="/api/events"
          redirectRoute="/events/all"
        />
        {this.renderMap()}
      </Fragment>
    )
  }
}


const mapStateToProps = state => {
  return { event: state.event, googleMapsKey: state.googleMapsKey }
}


export default connect(mapStateToProps)(EventsShow)
