import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import SectionMedia from '@/Sections/SectionMedia'
import styles from './style.module.scss'


/**
 * SectionSlideshow will render a media slideshow across the width of the screen
 *
 * @prop timer - Integer - Milliseconds between media changes
 * @prop posts - Array[Object - Posts to be switched between]
 */
const SectionSlideshow = (props) => {

  const { timer, posts, emptyTitle, emptyMessage } = props

  if (posts.length === 0) {
    return (
      <section className={styles["section-slideshow"]}>
        <div className={styles["section-slideshow__empty"]}>
          <h2 className="heading-secondary">{emptyTitle}</h2>
          <h3 className="heading-tertiary">{emptyMessage}</h3>
        </div>
      </section>
    )
  }

  const [counter, setCounter] = useState(0)
  const [ticker, setTicker] = useState(null)

  useEffect(() => {
    setTicker(setInterval(incrimentCounter, timer || 5000))
    return () => {
      if (ticker) clearInterval(ticker)
    }
  }, [])


  const incrimentCounter = () => {
    setCounter(prevCounter =>
      prevCounter === posts.length - 1 ? 0 : prevCounter + 1
    )
  }


  const renderSlides = () => {
    return _.map(posts, (post, i) => {

      const slideClassName = counter !== i
        ? styles['slide--hidden']
        : ''

      return (
        <SectionMedia
          key={post._id}
          post={post}
          className={`${slideClassName} ${styles['slide']}`}
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
          className={styles["section-slideshow__button"]}
          type="radio"
          checked={counter === i ? true : false}
          onChange={() => {}}
          key={post._id}
        />
      )
    })
  }


  return (
    <section className={styles["section-slideshow"]}>
      {renderSlides()}
      <div className={styles["section-slideshow__buttons"]}>
        {renderButtons()}
      </div>
    </section>
  )
}


export const options = {
  Slideshow: {
    file: 'SectionSlideshow',
    name: 'Slideshow Section',
    description: 'This section will display a slideshow of each post at 5 second intervals.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    maxPosts: null,
    defaultProps: {
      timer: 5000
    }
  }
}


export default SectionSlideshow
