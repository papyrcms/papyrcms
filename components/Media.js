import React from 'react'
import Modal from './Modal'


/**
 * Media dynamically renders video/img elements
 * 
 * @prop src - String - The course of the media
 * @prop className - String - The class name of the video/img element
 * @prop alt - String - The alt property for a passed image
 */
const Media = props => {

  const { src, className, alt, parallax, clickable } = props

  switch (true) {

    // If there is no src, return nothing
    case (src === '' || !src):
      return null

    // If it's a parallax image, we need the image in the style
    case parallax:
      return <div className={className || ''} style={{ backgroundImage: `url(${src})` }} />

    // If the src is a video, make it a video
    case !!src.match(/\.(mp4|webm)$/i):
      return (
        <video className={className || ''} autoPlay muted loop>
          <source src={src} type="video/mp4" />
          <source src={src} type="video/webm" />
          Your browser is not supported.
        </video>
      )

    // By default, return it as an image
    default:

      if (clickable) {
        return (

          <Modal
            image
            className={className || ''}
            src={src}
            alt={alt || ''}
          />
        )
      }

      return (
        <img
          className={className || ''}
          src={src}
          alt={alt || ''}
        />
      )
  }

  return null
}


export default Media
