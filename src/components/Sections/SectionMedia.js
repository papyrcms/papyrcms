import React from 'react'
import renderHTML from 'react-render-html'
import Media from '../Media'


/**
 * SectionMedia will render an image or video across the width
 * of the screen
 *
 * @prop className - String - The classname to prefix each class for the media
 * @prop posts - Array[Object - One post to be rendered]
 * @prop fixed - Boolean - Determine whether the media will be fixed to the background or scroll with the view
 * @prop alt - String - The alt attribute for the media
 */
const SectionMedia = (props) => {

  if (!props.post) {
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

  const { title, content, mainMedia } = props.post
  const { fixed, alt } = props
  let className = props.className || 'section-media'

  return (
    <section className={`${className}${fixed ? '--fixed' : ''}`}>

      <div className={`${className}__text`}>
        <h2 className={`${className}__title`}>{title}</h2>
        <div className={`${className}__subtext`}>{renderHTML(content)}</div>
      </div>

      <Media
        className={`${className}__media${fixed ? '--fixed' : ''}`}
        src={mainMedia}
        alt={alt}
        parallax={fixed}
      />

    </section>
  )
}

export default SectionMedia
