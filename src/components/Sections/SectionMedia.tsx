import { Post, SectionOptions } from 'types'
import React from 'react'
import renderHTML from 'react-render-html'
import Media from '@/components/Media'

type Props = {
  post: Post
  emptyMessage?: string
  emptyTitle?: string
  fixed?: boolean
  alt: string
  className?: string
}

/**
 * SectionMedia will render an image or video across the width
 * of the screen
 *
 * @prop className - String - The classname to prefix each class for the media
 * @prop posts - Array[Object - One post to be rendered]
 * @prop fixed - Boolean - Determine whether the media will be fixed to the background or scroll with the view
 * @prop alt - String - The alt attribute for the media
 */
const SectionMedia: React.FC<Props> = (props) => {
  if (!props.post) {
    const { emptyTitle, emptyMessage } = props

    return (
      <section className="section-media">
        <div className="section-media__empty">
          <h2 className="heading-secondary">{emptyTitle}</h2>
          <h3 className="heading-tertiary">{emptyMessage}</h3>
        </div>
      </section>
    )
  }

  const { title, content, mainMedia } = props.post
  const { fixed, alt, className } = props

  return (
    <section
      className={`${className} section-media${
        fixed ? '--fixed' : ''
      }`}
    >
      <div className="section-media__text">
        <h2 className="section-media__title">{title}</h2>
        <div className="section-media__subtext">
          {renderHTML(content)}
        </div>
      </div>

      <Media
        className={`section-media__media${fixed ? '--fixed' : ''}`}
        src={mainMedia || ''}
        alt={alt}
        parallax={fixed}
      />
    </section>
  )
}

export const options: SectionOptions = {
  Parallax: {
    file: 'SectionMedia',
    name: 'Parallax Section',
    description:
      'This section will display a post with the parallax effect on the media.',
    inputs: ['className', 'tags', 'title'],
    maxPosts: 1,
    defaultProps: {
      fixed: true,
    },
  },
  Media: {
    file: 'SectionMedia',
    name: 'Media Section',
    description: 'This section will display a post media normally.',
    inputs: ['className', 'tags', 'title'],
    maxPosts: 1,
    defaultProps: {},
  },
}

export default SectionMedia
