import { Post } from '@/types'
import React from 'react'
import renderHTML from 'react-render-html'
import { Media } from '@/components'
import styles from './SectionMedia.module.scss'

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
      <section className={styles.section}>
        <div className={styles.empty}>
          <h2 className="heading-secondary">{emptyTitle}</h2>
          <h3 className="heading-tertiary">{emptyMessage}</h3>
        </div>
      </section>
    )
  }

  const { title, content, media } = props.post
  const { fixed, alt, className } = props

  return (
    <section
      className={`${className || ''} ${
        fixed ? styles.fixed : styles.section
      }`}
    >
      <div className={styles.text}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.subtext}>{renderHTML(content)}</div>
      </div>

      <Media
        className={fixed ? styles.fixedMedia : styles.media}
        src={media || ''}
        alt={alt}
        parallax={fixed}
      />
    </section>
  )
}

export default SectionMedia
