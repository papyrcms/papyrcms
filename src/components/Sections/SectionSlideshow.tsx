import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import SectionMedia from './SectionMedia'

type Props = {
  timer: number,
  posts: Array<Post>
  emptyTitle: string,
  emptyMessage: string
}

/**
 * SectionSlideshow will render a media slideshow across the width of the screen
 *
 * @prop timer - Integer - Milliseconds between media changes
 * @prop posts - Array[Object - Posts to be switched between]
 */
const SectionSlideshow = (props: Props) => {

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
  const [ticker, setTicker] = useState<null | NodeJS.Timeout>(null)

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
      return (
        <SectionMedia
          key={post._id}
          post={post}
          className={`${counter !== i ? 'slide--hidden' : ''} slide`}
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

export default SectionSlideshow
