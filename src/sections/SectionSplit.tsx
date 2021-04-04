import { SectionOptions, Post } from 'types'
import React from 'react'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import Link from 'next/link'
import { Media } from '@/components'

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

const SectionSplit: React.FC<Props> = (props) => {
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
            className="section-split__image"
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
    const contentLength = props.contentLength || 500
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
        ? 'section-split__text'
        : 'section-split__text--wide'

      return (
        <div className="section-split__post" key={post._id}>
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
    <section className={`${className || ''} section-split`}>
      {beforeTitle()}
      <h2 className="heading-secondary section-split__header">
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
  Split: {
    component: 'SectionSplit',
    name: 'Split Section',
    description:
      'This section will display an image, a title, and some content, split down the middle with the image on one side and the text on the other, alternating which order by each row.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    defaultProps: {
      readMore: true,
      contentLength: 500,
    },
  },
  LeftSplit: {
    component: 'SectionSplit',
    name: 'Left Split Section',
    description:
      'This section will display an image, a title, and some content, split down the middle with the image on one side and the text on the other, with the image on the left side.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    defaultProps: {
      readMore: true,
      contentLength: 500,
      mediaLeft: true,
    },
  },
  RightSplit: {
    component: 'SectionSplit',
    name: 'Right Split Section',
    description:
      'This section will display an image, a title, and some content, split down the middle with the image on one side and the text on the other, with the image on the right side.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    defaultProps: {
      readMore: true,
      contentLength: 500,
      mediaRight: true,
    },
  },
}

export default SectionSplit
