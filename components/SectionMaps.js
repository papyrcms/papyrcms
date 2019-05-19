import React, { Component } from 'react'
import renderHTML from 'react-render-html'
import GoogleMapReact from 'google-map-react'
import keys from '../config/keys'

const Position = () => <div className="section-maps__position" />

class SectionMaps extends Component {

  renderMap(latitude, longitude, zoom = 15) {

    const center = {
      lat: latitude,
      lng: longitude
    }

    return (
      <div className="section-maps__map">
        <GoogleMapReact
          bootstrapURLKeys={{ key: keys.googleMapsKey }}
          defaultCenter={center}
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


  render() {

    let latitudePost
    let longitudePost
    let contentPost

    // Pick out the text, latitude, and logitude posts
    this.props.posts.forEach(post => {
      switch (true) {
        case post.tags.includes('latitude'):
          latitudePost = post
          break
        case post.tags.includes('longitude'):
          longitudePost = post
          break
        default: 
          contentPost = post
      }
    })

    if (!contentPost || !longitudePost || !latitudePost) {
      return null
    }
  
    const { title, content } = contentPost
    const latitude = parseFloat(latitudePost.title)
    const longitude = parseFloat(longitudePost.title)
    const mapLocation = this.props.mapLocation ? this.props.mapLocation : 'start'
  
    return (
      <section className="section-maps">

        {mapLocation === 'start' ? this.renderMap(latitude, longitude) : null}
  
        <div className={'section-maps__text'}>
          <h2 className={'section-maps__title'}>{title}</h2>
          <div className={'section-maps__subtext'}>{renderHTML(content)}</div>
        </div>

        {mapLocation === 'end' ? this.renderMap(latitude, longitude) : null}

      </section>
    )
  }
}

export default SectionMaps
