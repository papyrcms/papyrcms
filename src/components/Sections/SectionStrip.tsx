import { SectionOptions, Post } from 'types'
import React from 'react'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import Link from 'next/link'
import Media from '@/components/Media'

type Props = {
  clickableMedia?: boolean
  mediaLeft?: boolean
  mediaRight?: boolean
  readMore?: boolean
  path?: string
  emptyMessage?: string
  className?: string
  posts: Post[]
  title?: string
  contentLength?: number

  // Section hooks
  beforeTitle?: Function
  afterTitle?: Function
  beforePosts?: Function
  afterPosts?: Function

  // Post hooks
  beforePostTitle?: Function
  afterPostTitle?: Function
  beforePostMedia?: Function
  afterPostMedia?: Function
  beforePostContent?: Function
  afterPostContent?: Function
  beforePostLink?: Function
  afterPostLink?: Function
}

/**
 * SectionStrip will render Posts in a more horizontal style
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
 * @prop afterPosts - Function - Rendered after the section cards
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
const SectionStrip: React.FC<Props> = (props) => {
  const {
    clickableMedia,
    mediaLeft,
    mediaRight,
    readMore,
    path,
    emptyMessage,
    className,
    posts,
    title,

    // Section hooks
    beforeTitle = () => null,
    afterTitle = () => null,
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
    afterPostLink = () => null,
  } = props

  const renderMedia = (post: Post) => {
    if (post.mainMedia) {
      return (
        <>
          {beforePostMedia(post)}
          <Media
            className="section-strip__image"
            src={post.mainMedia}
            alt={post.title}
            clickable={clickableMedia}
          />
          {afterPostMedia(post)}
        </>
      )
    }
  }

  const renderRightMedia = (post: Post, i: number) => {
    if (mediaRight && !mediaLeft) {
      return renderMedia(post)
    } else if (
      ((!mediaRight && !mediaLeft) || (mediaRight && mediaLeft)) &&
      i % 2 !== 0 &&
      post.mainMedia
    ) {
      return renderMedia(post)
    }
  }

  const renderLeftMedia = (post: Post, i: number) => {
    if (mediaLeft && !mediaRight) {
      return renderMedia(post)
    } else if (
      ((!mediaRight && !mediaLeft) || (mediaRight && mediaLeft)) &&
      i % 2 === 0 &&
      post.mainMedia
    ) {
      return renderMedia(post)
    }
  }

  const renderContent = (post: Post) => {
    const contentLength = props.contentLength || 300
    let postContent =
      post.content && post.content.length >= contentLength
        ? `${post.content.substring(0, contentLength).trim()} . . .`
        : post.content

    if (!readMore) {
      return (
        <>
          {beforePostContent(post)}
          {renderHTML(post.content)}
          {afterPostContent(post)}
        </>
      )
    }

    return (
      <>
        {beforePostContent(post)}
        {renderHTML(postContent)}
        {afterPostContent(post)}

        {beforePostLink(post)}
        <Link
          href={`/${path || 'posts'}/[id]`}
          as={`/${path || 'posts'}/${post.slug || post._id}`}
        >
          <a>Read More</a>
        </Link>
        {afterPostLink(post)}
      </>
    )
  }

  const renderPosts = () => {
    if (posts.length === 0) {
      return (
        <h3 className="heading-tertiary">
          {emptyMessage ? emptyMessage : ''}
        </h3>
      )
    }

    return _.map(posts, (post, i) => {
      const postTextClassName = post.mainMedia
        ? 'section-strip__text'
        : 'section-strip__text--wide'

      return (
        <div className="section-strip__post" key={post._id}>
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
    <section className={`${className || ''} section-strip`}>
      {beforeTitle()}
      <h2 className="heading-secondary section-strip__header">
        {title}
      </h2>
      {afterTitle()}

      {beforePosts()}
      {renderPosts()}
      {afterPosts()}
    </section>
  )
}

export const options: SectionOptions = {
  Strip: {
    component: 'SectionStrip',
    name: 'Strip Section',
    description:
      'This section will display each post in a horizontal style with the media alternating rendering on the left and right sides per post.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    // maxPosts: null,
    defaultProps: {
      readMore: true,
      contentLength: 300,
    },
  },
  LeftStrip: {
    component: 'SectionStrip',
    name: 'Left Strip Section',
    description:
      'This section will display each post in a horizontal style with the media rendering on the left side of the posts.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    // maxPosts: null,
    defaultProps: {
      readMore: true,
      contentLength: 300,
      mediaLeft: true,
    },
  },
  RightStrip: {
    component: 'SectionStrip',
    name: 'Right Strip Section',
    description:
      'This section will display each post in a horizontal style with the media rendering on the right side of the posts.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    // maxPosts: null,
    defaultProps: {
      readMore: true,
      contentLength: 300,
      mediaRight: true,
    },
  },
}

export default SectionStrip
