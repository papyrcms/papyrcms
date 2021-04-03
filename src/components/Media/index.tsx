import React from 'react'
import Modal from '../Modal'
import styles from './Media.module.scss'

type Props = {
  src: string
  className?: string
  alt: string
  parallax?: boolean
  clickable?: boolean
}

const Media = (props: Props) => {
  const { src, className, alt, parallax, clickable } = props

  // If there is no src, return nothing
  if (src === '' || !src) return null

  // If it's a parallax image, we need the image in the style
  if (parallax) {
    return (
      <div
        className={className || ''}
        style={{ backgroundImage: `url(${src})` }}
      />
    )
  }

  // If the src is a video, make it a video
  if (!!src.match(/\.(mp4|webm)$/i))
    return (
      <video className={className || ''} autoPlay muted loop>
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        Your browser is not supported.
      </video>
    )

  // By default, return it as an image
  if (clickable)
    return (
      <Modal
        image
        className={className || ''}
        src={src}
        alt={alt || ''}
      />
    )

  return <img className={className || ''} src={src} alt={alt || ''} />
}

export default Media
