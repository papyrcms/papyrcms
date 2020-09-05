import React, { useContext } from 'react'
import GoogleMapReact from 'google-map-react'
import keysContext from '@/context/keysContext'

type Coords = {
  lat: number
  lng: number
}

const Position = (coords: Coords) => <div className="map__position" />

type Props = {
  className?: string
  latitude: number
  longitude: number
  zoom?: number
}

const Map = (props: Props) => {

  const {
    className = '',
    latitude,
    longitude,
    zoom = 14
  } = props

  const { keys } = useContext(keysContext)
  
  if (!latitude || !longitude) {
    return null
  }

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
