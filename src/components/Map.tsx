import React, { useContext } from 'react'
import GoogleMapReact from 'google-map-react'
import keysContext from '../context/keysContext'


const Position: any = () => <div className="map__position" />

const Map = props => {

  const {
    className = '',
    latitude,
    longitude,
    zoom = 14
  } = props

  if (!latitude || !longitude) {
    return null
  }

  const { keys } = useContext(keysContext)

  return (
    <div className={`map ${className}`}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: keys['googleMapsKey'] }}
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


export default Map
