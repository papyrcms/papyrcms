import React from 'react'
import renderHTML from 'react-render-html'
import Link from 'next/link'
import moment from 'moment-timezone'
import Media from '../Media'


/**
 * SectionStandard will render Posts in a more horizontal style
 *
 * @prop title - String - The title to display above the cards
 * @prop readMore - Boolean - If true, a link to the full post will render at the bottom of each card
 * @prop path - String - The path to use for the read more link before the post id ('/{path}/a1s2d3f4g5h6j7')
 * @prop contentLength - String - How many characters to show in the card content
 * @prop emptyMessage - String - Message to display if there are no posts
 * @prop posts - Array [Object - The post to be rendered as a card]
 * @prop showDate - String - The post date prop to show
 * @prop clickableMedia - Boolean - If true, the media will display as a modal when clicked
 * @prop mediaRight - Boolean - If true, the media will render on the right side
 * @prop mediaLeft - Boolean - If true, the media will render on the left side
 */
const SectionStandard = props => {

  const {
    clickableMedia, mediaLeft, mediaRight,
    readMore, path, showDate, emptyMessage,
    className, posts, title
  } = props


  const renderMedia = post => {
    if (post.mainMedia) {
      return <Media
        className="section-standard__image"
        src={post.mainMedia}
        alt={post.title}
        clickable={clickableMedia}
      />
    }
  }


  const renderRightMedia = (post, i) => {
    if (mediaRight && !mediaLeft) {
      return renderMedia(post)
    } else if (
      (
        (!mediaRight && !mediaLeft) ||
        (mediaRight && mediaLeft)
      ) &&
      i % 2 !== 0 && post.mainMedia
    ) {
      return renderMedia(post)
    }
  }


  const renderLeftMedia = (post, i) => {
    if (mediaLeft && !mediaRight) {
      return renderMedia(post)
    } else if (
      (
        (!mediaRight && !mediaLeft) ||
        (mediaRight && mediaLeft)
      ) &&
      i % 2 === 0 && post.mainMedia
    ) {
      return renderMedia(post)
    }
  }


  const renderContent = post => {

    const contentLength = props.contentLength || 300
    let postContent = post.content.length >= contentLength ? `${post.content.substring(0, contentLength).trim()} . . .` : post.content

    if (!readMore) {
      return renderHTML(post.content)
    }

    return (
      <div>
        {renderHTML(postContent)}
        <Link href={`/${path || 'posts'}/show?id=${post._id}`} as={`/${path || 'posts'}/${post.slug || post._id}`}>
          <a>Read More</a>
        </Link>
      </div>
    )
  }


  const renderDate = post => {
    if (showDate) {
      const date = post[showDate] ? post[showDate] : post.created
      return <p>{moment(date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
    }
  }


  const renderPosts = () => {

    if (posts.length === 0) {
      return <h3 className="heading-tertiary">{emptyMessage ? emptyMessage : ''}</h3>
    }

    return posts.map((post, i) => {

      const postTextClassName = post.mainMedia ? 'section-standard__text' : 'section-standard__text--wide'

      return (
        <div className="section-standard__post" key={post._id}>
          {renderLeftMedia(post, i)}
          <div className={postTextClassName}>
            <h3 className="heading-tertiary">{post.title}</h3>
            {renderDate(post)}
            {renderContent(post)}
          </div>
          {renderRightMedia(post, i)}
        </div>
      )
    })
  }


  return (
    <section className={`${className || ''} section-standard`}>
      <h2 className="heading-secondary section-standard__header">{title}</h2>
      {renderPosts()}
    </section>
  )
}

export default SectionStandard
