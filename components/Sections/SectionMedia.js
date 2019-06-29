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

  const { title, content, mainMedia } = props.posts[0]
  const { fixed, alt } = props
  let { className } = props;
  className = className ? className : 'media'

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
      />

    </section>
  )
}

export default SectionMedia
