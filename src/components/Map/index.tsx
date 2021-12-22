import React, { useContext } from 'react'
import GoogleMapReact from 'google-map-react'
import { useKeys } from '@/context'
import styles from './Map.module.scss'

type Coords = {
  lat: number
  lng: number
}

const Position = (coords: Coords) => (
  <div className={styles.position} />
)

type Props = {
  className?: string
  latitude: number
  longitude: number
  zoom?: number
}

const Map: React.FC<Props> = (props) => {
  const { className = '', latitude, longitude, zoom = 14 } = props

  const { keys } = useKeys()

  if (!latitude || !longitude) {
    return null
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: keys['googleMapsKey'] }}
        defaultCenter={{ lat: latitude, lng: longitude }}
        defaultZoom={zoom}
      >
        <Position lat={latitude} lng={longitude} />
      </GoogleMapReact>
    </div>
  )
}

export default Map
