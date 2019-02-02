import React from 'react'
import renderHTML from 'react-render-html'
import Media from './Media'

const SectionMedia = props => {

  const { title, content, mainMedia } = props.posts[0]
  const { className, fixed, alt } = props

  return (
    <section className={`${className}${fixed ? '--fixed' : '' }`}>

      <div className={`${className}__text`}>
        <h2 className={`${className}__title`}>{ title }</h2>
        <div className={`${className}__subtext`}>{ renderHTML( content ) }</div>
      </div>
      
      <Media
        className={`${className}__media${ fixed ? '--fixed' : '' }`}
        src={ mainMedia }
        alt={ alt }
      />

    </section>
  )
}

export default SectionMedia
