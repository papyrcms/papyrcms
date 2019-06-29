import React from 'react'

/**
 * Media dynamically renders video/img elements
 * 
 * props includes:
 *   src: String - The course of the media
 *   className: String - The class name of the video/img element
 *   alt: String - The alt property for a passed image
 */
const Media = props => {

  const { src, className, alt } = props

  if (src.match(/\.(mp4|webm)$/i)) {
    return (
      <video className={className} autoPlay muted loop>
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        Your browser is not supported.
      </video>
    )
  } else if (src === '' || !src) {
    return null
  } else {
    return (
      <img
        className={className}
        src={src}
        alt={alt}
      />
    )
  }
}

export default Media
