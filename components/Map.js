import React from 'react'
import GoogleMapReact from 'google-map-react'
import { connect } from 'react-redux'


const Position = () => <div className="map__position" />

const Map = props => {

  const {
    className = '',
    googleMapsKey,
    latitude,
    longitude,
    zoom = 14
  } = props

  if (!latitude || !longitude) {
    return null
  }

  return (
    <div className={`map ${className}`}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: googleMapsKey }}
        defaultCenter={{ lat: latitude, lng: longitude }}
        defaultZoom={zoom}
      >
        <Position
          lat={latitude}
          lng={longitude}
        />
      </GoogleMapReact>
    </div>
  )
}


const mapStateToProps = state => {
  return { googleMapsKey: state.googleMapsKey }
}


export default connect(mapStateToProps)(Map)
