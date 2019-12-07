import React from 'react'
import moment from 'moment-timezone'
import renderHTML from 'react-render-html'
import Link from 'next/link'
import Media from '../Media'


/**
 * SectionCards will display a section of card-like components
 *
 * @prop title - String - The title to display above the cards
 * @prop perRow - Integer - How many cards will fit on one row at full width - must be 3 or 4
 * @prop readMore - Boolean - If true, a link to the full post will render at the bottom of each card
 * @prop path - String - The path to use for the read more link before the post id ('/{path}/a1s2d3f4g5h6j7')
 * @prop contentLength - String - How many characters to show in the card content
 * @prop emptyMessage - String - Message to display if there are no posts
 * @prop posts - Array [Object - The post to be rendered as a card]
 * @prop showDate - Boolean - If true, the publish or created date will show
 * @prop clickableMedia - Boolean - If true, the media will display as a modal when clicked
 * @prop infoProps - Object {
 *   before - String - Text to display before the property
 *   property - String - The property of the post to render
 *   after - String - Text to display after the property
 * }
 */
const SectionCards = props => {

  const {
    posts, contentLength, emptyMessage,
    perRow, title, path, readMore,
    infoProps, showDate, clickableMedia
  } = props


  const renderReadMore = post => {
    if (readMore) {
      const readMorePath = path ? path : 'posts'

      return (
        <Link href={`/${readMorePath || 'posts'}/show?id=${post._id}`} as={`/${readMorePath || 'posts'}/${post.slug || post._id}`}>
          <a className="section-cards__link">Read More</a>
        </Link>
      )
    }
  }


  const renderInfoProps = post => {
    if (infoProps) {
      return Object.keys(infoProps).map(key => {
        const prop = infoProps[key]

        return (
          <div key={`${post._id}-${prop.property}`} className="section-cards__info">
            <span className="section-cards__info--before">{prop.before}</span>
            <span className="section-cards__info--prop">{post[prop.property]}</span>
            <span className="section-cards__info--after">{prop.after}</span>
          </div>
        )
      })
    }
  }


  const renderPublishSection = published => {
    if (!published) {
      return <p><em>Not published</em></p>
    }
  }


  const renderDate = post => {
    if (showDate) {

      const date = post.published && post.publishDate
        ? post.publishDate
        : post.created

      return <p>{moment(date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
    }
  }


  const renderMediaSection = post => {
    if (post.mainMedia) {
      return <Media
        className="section-cards__image"
        src={post.mainMedia}
        alt={post.title}
        clickable={clickableMedia}
      />
    }
  }


  const renderPosts = () => {

    if (posts.length === 0) {
      return (
        <div className="section-cards__empty-message">
          <h3 className="heading-tertiary">{emptyMessage ? emptyMessage : ''}</h3>
        </div>
      )
    }

    // Set defaults for characterCount
    const characterCount = contentLength || 300

    return posts.map(post => {

      let postContent = post.content.length >= characterCount ? `${post.content.substring(0, characterCount).trim()} . . .` : post.content

      return (
        <li key={post._id} className="section-cards__card">
          <h3 className="section-cards__title heading-tertiary">{post.title}</h3>
          {renderDate(post)}
          {renderPublishSection(post.published)}
          {renderMediaSection(post)}
          {renderInfoProps(post)}
          <div className="section-cards__content">{renderHTML(postContent)}</div>
          {renderReadMore(post)}
        </li>
      )
    })
  }


  const listCountClass = perRow ? `section-cards__list--${perRow}` : 'section-cards__list--3'

  return (
    <section className='section-cards'>
      <h2 className='heading-secondary section-cards__header'>{title}</h2>
      <ul className={`section-cards__list ${listCountClass}`}>
        {renderPosts()}
      </ul>
    </section>
  )
}


export default SectionCards
