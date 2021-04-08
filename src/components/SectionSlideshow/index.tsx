import { Post } from '@/types'
import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { SectionMedia } from '@/components'
import styles from './SectionSlideshow.module.scss'

type Props = {
  timer?: number
  posts: Post[]
  emptyTitle?: string
  emptyMessage?: string
}

/**
 * SectionSlideshow will render a media slideshow across the width of the screen
 *
 * @prop timer - Integer - Milliseconds between media changes
 * @prop posts - Array[Object - Posts to be switched between]
 */
const SectionSlideshow: React.FC<Props> = (props) => {
  const { timer, posts, emptyTitle, emptyMessage } = props

  if (posts.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.empty}>
          <h2 className="heading-secondary">{emptyTitle}</h2>
          <h3 className="heading-tertiary">{emptyMessage}</h3>
        </div>
      </section>
    )
  }

  const [counter, setCounter] = useState(0)
  const [ticker, setTicker] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const interval = setInterval(incrimentCounter, timer || 5000)
    setTicker(interval)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const incrimentCounter = () => {
    setCounter((prevCounter) =>
      prevCounter === posts.length - 1 ? 0 : prevCounter + 1
    )
  }

  const renderSlides = () => {
    return _.map(posts, (post, i) => {
      const slideClassName = counter !== i ? styles.hidden : ''

      return (
        <SectionMedia
          key={post._id}
          post={post}
          className={`${slideClassName} ${styles.slide}`}
          alt={post.title}
        />
      )
    })
  }

  const renderButtons = () => {
    return _.map(posts, (post, i) => {
      return (
        <input
          onClick={() => {
            if (ticker) clearInterval(ticker)
            setCounter(i)
          }}
          className={styles.button}
          type="radio"
          checked={counter === i ? true : false}
          onChange={() => {}}
          key={post._id}
        />
      )
    })
  }

  return (
    <section className={styles.section}>
      {renderSlides()}
      <div className={styles.buttons}>{renderButtons()}</div>
    </section>
  )
}

export default SectionSlideshow
