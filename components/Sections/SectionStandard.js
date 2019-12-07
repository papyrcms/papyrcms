import React, { Fragment } from 'react'
import renderHTML from 'react-render-html'
import Link from 'next/link'
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
 * @prop clickableMedia - Boolean - If true, the media will display as a modal when clicked
 * @prop mediaRight - Boolean - If true, the media will render on the right side
 * @prop mediaLeft - Boolean - If true, the media will render on the left side
 *
 * Section Hooks
 * @prop beforeTitle - Function - Rendered before the section title
 * @prop afterTitle - Function - Rendered after the section title
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
const SectionStandard = props => {

  const {
    clickableMedia, mediaLeft, mediaRight,
    readMore, path, emptyMessage,
    className, posts, title
  } = props


  // Section hooks
  const beforeTitle = () => props.beforeTitle ? props.beforeTitle(props) : null
  const afterTitle = () => props.afterTitle ? props.afterTitle(props) : null
  const beforePosts = () => props.beforePosts ? props.beforePosts(props) : null
  const afterPosts = () => props.afterPosts ? props.afterPosts(props) : null

  // Post hooks
  const beforePostTitle = post => props.beforePostTitle ? props.beforePostTitle(props, post) : null
  const afterPostTitle = post => props.afterPostTitle ? props.afterPostTitle(props, post) : null
  const beforePostMedia = post => props.beforePostMedia ? props.beforePostMedia(props, post) : null
  const afterPostMedia = post => props.afterPostMedia ? props.afterPostMedia(props, post) : null
  const beforePostContent = post => props.beforePostContent ? props.beforePostContent(props, post) : null
  const afterPostContent = post => props.afterPostContent ? props.afterPostContent(props, post) : null
  const beforePostLink = post => props.beforePostLink ? props.beforePostLink(props, post) : null
  const afterPostLink = post => props.afterPostLink ? props.afterPostLink(props, post) : null


  const renderMedia = post => {
    if (post.mainMedia) {
      return (
        <Fragment>
          {beforePostMedia(post)}
          <Media
            className="section-standard__image"
            src={post.mainMedia}
            alt={post.title}
            clickable={clickableMedia}
          />
          {afterPostMedia(post)}
        </Fragment>
      )
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
      return (
        <Fragment>
          {beforePostContent(post)}
          {renderHTML(post.content)}
          {afterPostContent(post)}
        </Fragment>
      )
    }

    return (
      <Fragment>
        {beforePostContent(post)}
        {renderHTML(postContent)}
        {afterPostContent(post)}

        {beforePostLink(post)}
        <Link href={`/${path || 'posts'}/show?id=${post._id}`} as={`/${path || 'posts'}/${post.slug || post._id}`}>
          <a>Read More</a>
        </Link>
        {afterPostLink(post)}
      </Fragment>
    )
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

            {beforePostTitle(post)}
            <h3 className="heading-tertiary">{post.title}</h3>
            {afterPostTitle(post)}

            {renderContent(post)}

          </div>
          {renderRightMedia(post, i)}
        </div>
      )
    })
  }


  return (
    <section className={`${className || ''} section-standard`}>

      {beforeTitle()}
      <h2 className="heading-secondary section-standard__header">{title}</h2>
      {afterTitle()}

      {beforePosts()}
      {renderPosts()}
      {afterPosts()}

    </section>
  )
}

export default SectionStandard
