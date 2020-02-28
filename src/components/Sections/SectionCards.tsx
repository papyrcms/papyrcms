import React from 'react'
import _ from 'lodash'
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
 * @prop clickableMedia - Boolean - If true, the media will display as a modal when clicked
 *
 * Section Hooks
 * @prop beforeTitle - Function - Rendered before the section title
 * @prop afterTitle - Function - Rendered after the section title
 * @prop beforePostList - Function - Rendered before the section card list
 * @prop beforePostList - Function - Rendered before the section card list
 * @prop beforePosts - Function - Rendered before the section cards
 * @prop beforePosts - Function - Rendered before the section cards
 *
 * Post Hooks
 * @prop beforePostTitle - Function - Rendered before the card title
 * @prop afterPostTitle - Function - Rendered after the card title
 * @prop beforePostMedia - Function - Rendered before the card media
 * @prop afterPostMedia - Function - Rendered after the card media
 * @prop beforePostContent - Function - Rendered before the card content
 * @prop afterPostContent - Function - Rendered after the card content
 * @prop beforePostLink - Function - Rendered before the card link
 * @prop afterPostLink - Function - Rendered after the card link
 */
const SectionCards = props => {

  const {
    posts, contentLength, emptyMessage,
    perRow, title, path, readMore, clickableMedia,

    // Section hooks
    beforeTitle = () => null,
    afterTitle = () => null,
    beforePostList = () => null,
    afterPostList = () => null,
    beforePosts = () => null,
    afterPosts = () => null,

    // Post hooks
    beforePostTitle = () => null,
    afterPostTitle = () => null,
    beforePostMedia = () => null,
    afterPostMedia = () => null,
    beforePostContent = () => null,
    afterPostContent = () => null,
    beforePostLink = () => null,
    afterPostLink = () => null
  } = props


  const renderReadMore = post => {
    if (readMore) {
      const readMorePath = path ? path : 'posts'

      return (
        <Link href={`/${readMorePath || 'posts'}/[id]`} as={`/${readMorePath || 'posts'}/${post.slug || post._id}`}>
          <a className="section-cards__link">Read More</a>
        </Link>
      )
    }
  }


  const renderPublishSection = published => {
    if (!published) {
      return <p><em>Not published</em></p>
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

    return _.map(posts, post => {

      let postContent = post.content.length >= characterCount ? `${post.content.substring(0, characterCount).trim()} . . .` : post.content

      return (
        <li key={post._id} className="section-cards__card">

          {beforePostTitle(post)}
          <h3 className="section-cards__title heading-tertiary">{post.title}</h3>
          {afterPostTitle(post)}

          {renderPublishSection(post.published)}

          {beforePostMedia(post)}
          {renderMediaSection(post)}
          {afterPostMedia(post)}

          {beforePostContent(post)}
          <div className="section-cards__content">{renderHTML(postContent)}</div>
          {afterPostContent(post)}

          {beforePostLink(post)}
          {renderReadMore(post)}
          {afterPostLink(post)}

        </li>
      )
    })
  }


  const listCountClass = perRow ? `section-cards__list--${perRow}` : 'section-cards__list--3'

  return (
    <section className='section-cards'>

      {beforeTitle()}
      <h2 className='heading-secondary section-cards__header'>{title}</h2>
      {afterTitle()}

      {beforePostList()}
      <ul className={`section-cards__list ${listCountClass}`}>

        {beforePosts()}
        {renderPosts()}
        {afterPosts()}

      </ul>
      {afterPostList()}

    </section>
  )
}


export default SectionCards
