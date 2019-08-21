/**
 * SectionMedia will render an image or video across the width
 * of the screen
 * 
 * props include:
 *   className: String - The classname to prefix each class for the media
 *   posts: Array[Object - One post to be rendered]
 *   fixed: Boolean - Determine whether the media will be fixed to the background or scroll with the view
 *   alt: String - The alt attribute for the media
 */


import React from 'react'
import renderHTML from 'react-render-html'
import Media from '../Media'

const SectionMedia = props => {

  if (props.post) {

    const { title, content, mainMedia } = props.post
    const { fixed, alt } = props
  
    return (
      <section className={`section-media${fixed ? '--fixed' : ''}`}>
  
        <div className='section-media__text'>
          <h2 className='section-media__title'>{title}</h2>
          <div className='section-media__subtext'>{renderHTML(content)}</div>
        </div>
  
        <Media
          className={`section-media__media${fixed ? '--fixed' : ''}`}
          src={mainMedia}
          alt={alt}
          parallax={fixed}
        />
  
      </section>
    )
  } else {

    const { emptyTitle, emptyMessage } = props

    return (
      <section className='section-media'>
        <div className='section-media__empty'>
          <h2 className='heading-secondary'>{emptyTitle}</h2>
          <h3 className='heading-tertiary'>{emptyMessage}</h3>
        </div>
      </section>
    )
  }
}

export default SectionMedia
