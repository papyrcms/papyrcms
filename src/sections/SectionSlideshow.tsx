import { SectionOptions, Post } from 'types'
import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { SectionMedia } from '@/sections'

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
      <section className="section-slideshow">
        <div className="section-slideshow__empty">
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
      const slideClassName = counter !== i ? 'slide--hidden' : ''

      return (
        <SectionMedia
          key={post._id}
          post={post}
          className={`${slideClassName} slide`}
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
          className="section-slideshow__button"
          type="radio"
          checked={counter === i ? true : false}
          onChange={() => {}}
          key={post._id}
        />
      )
    })
  }

  return (
    <section className="section-slideshow">
      {renderSlides()}
      <div className="section-slideshow__buttons">
        {renderButtons()}
      </div>
    </section>
  )
}

export const options: SectionOptions = {
  Slideshow: {
    component: 'SectionSlideshow',
    name: 'Slideshow Section',
    description:
      'This section will display a slideshow of each post at 5 second intervals.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    // maxPosts: null,
    defaultProps: {
      timer: 5000,
    },
  },
}

export default SectionSlideshow
