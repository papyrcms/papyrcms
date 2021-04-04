import { Post } from 'types'
import React from 'react'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import { Map } from '@/components'
import styles from './SectionMaps.module.scss'

type Props = {
  posts: Post[]
  emptyTitle?: string
  emptyMessage?: string
  mapLocation?: 'start' | 'end'
}

/**
 * SectionMaps will render a section with some text and a
 * google map at a particular location
 *
 * @prop mapLocation - String('start' or 'end') - renders the map before or after the content
 * @prop posts - Array[Object - latitude, longitude, and content posts]
 */
const SectionMaps: React.FC<Props> = (props) => {
  const {
    posts,
    emptyTitle,
    emptyMessage,
    mapLocation = 'start',
  } = props

  let latitudePost: Post
  let longitudePost: Post
  let contentPost: Post

  // Pick out the text, latitude, and logitude posts
  _.forEach(posts, (post) => {
    switch (true) {
      case post.tags.includes('latitude'):
        latitudePost = post
        break
      case post.tags.includes('longitude'):
        longitudePost = post
        break
      default:
        contentPost = post
    }
  })

  // If we don't have all the info we need
  // @ts-ignore posts are assgned in the forEach
  if (!contentPost || !longitudePost || !latitudePost) {
    return (
      <section className={styles.section}>
        <h2 className="heading-secondary">{emptyTitle}</h2>
        <h3 className="heading-tertiary">{emptyMessage}</h3>
      </section>
    )
  }

  // Get our coordinates
  const latitude = parseFloat(latitudePost.title)
  const longitude = parseFloat(longitudePost.title)

  const renderMap = () => {
    return <Map latitude={latitude} longitude={longitude} zoom={15} />
  }

  const { title, content } = contentPost

  return (
    <section className={styles.section}>
      <h2 className={`heading-secondary ${styles.title}`}>{title}</h2>

      <div className={styles.content}>
        {mapLocation === 'start' ? renderMap() : null}

        <div className={styles.text}>
          <div className={styles.subtext}>{renderHTML(content)}</div>
        </div>

        {mapLocation === 'end' ? renderMap() : null}
      </div>
    </section>
  )
}

export default SectionMaps
