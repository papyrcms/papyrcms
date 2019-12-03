import React, { Component } from 'react'
import renderHTML from 'react-render-html'
import GoogleMapReact from 'google-map-react'
import { connect } from 'react-redux'

const Position = () => <div className="section-maps__position" />


/**
 * SectionMaps will render a section with some text and a
 * google map at a particular location
 *
 * @prop mapLocation - String('start' or 'end') - renders the map before or after the content
 * @prop posts - Array[Object - latitude, longitude, and content posts]
 */
class SectionMaps extends Component {

  renderMap(latitude, longitude, zoom = 15) {

    const center = {
      lat: latitude,
      lng: longitude
    }

    return (
      <div className="section-maps__map">
        <GoogleMapReact
          bootstrapURLKeys={{ key: this.props.googleMapsKey }}
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

    if (contentPost && longitudePost && latitudePost) {

      const { title, content } = contentPost
      const latitude = parseFloat(latitudePost.title)
      const longitude = parseFloat(longitudePost.title)
      const mapLocation = this.props.mapLocation ? this.props.mapLocation : 'start'

      return (
        <section className="section-maps">
          <h2 className='heading-secondary section-maps__title'>{title}</h2>

          <div className="section-maps__content">
            {mapLocation === 'start' ? this.renderMap(latitude, longitude) : null}

            <div className='section-maps__text'>
              <div className='section-maps__subtext'>{renderHTML(content)}</div>
            </div>

            {mapLocation === 'end' ? this.renderMap(latitude, longitude) : null}
          </div>
        </section>
      )
    } else {

      const { emptyTitle, emptyMessage } = this.props

      return (
        <section className="section-maps">
          <h2 className="heading-secondary">{emptyTitle}</h2>
          <h3 className="heading-tertiary">{emptyMessage}</h3>
        </section>
      )
    }
  }
}


const mapStateToProps = state => {
  return { googleMapsKey: state.googleMapsKey }
}


export default connect(mapStateToProps)(SectionMaps)
