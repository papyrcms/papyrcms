import { Post } from '@/types'
import React from 'react'
import renderHTML from 'react-render-html'
import Link from 'next/link'
import _ from 'lodash'
import Media from '../Media'
import styles from './PostIndex.module.scss'

type Props = {
  posts: Post[]
}

const PostIndex = (props: Props) => {
  const renderTags = (tags: string[]) => {
    return _.map(tags, (tag, i) => {
      if (i < tags.length - 1) {
        return <span key={tag}>{tag}, </span>
      } else {
        return <span key={tag}>{tag}</span>
      }
    })
  }

  const renderTagsSection = (tags: string[]) => {
    if (tags.length > 0) {
      return (
        <p className={styles.tags}>
          Tags: <em>{renderTags(tags)}</em>
        </p>
      )
    }
  }

  const renderMediaSection = (media?: string, alt?: string) => {
    if (media) {
      return (
        <div className={styles.image}>
          <Media src={media} alt={alt || ''} />
        </div>
      )
    }
  }

  const renderPublishSection = (published: boolean) => {
    if (!published) {
      return (
        <p>
          <em>Not published</em>
        </p>
      )
    }
  }

  const renderPosts = () => {
    const { posts } = props

    if (!posts || posts.length === 0) {
      return (
        <h3 className="heading-tertiary">Nothing published yet</h3>
      )
    }

    return _.map(posts, (post) => {
      const { id, title, tags, media, content, published } = post

      let postContent = ''
      if (content) {
        postContent =
          content.length >= 200
            ? `${content.substring(0, 200).trim()} . . .`
            : content
      }

      return (
        <div key={id} className={styles.post}>
          {renderMediaSection(media, title)}
          <div className={styles.details}>
            <div className={styles.top}>
              <h3 className={`${styles.title} heading-tertiary`}>
                {title}
              </h3>
              {renderTagsSection(tags)}
              {renderPublishSection(published)}
            </div>
            <div className={styles.content}>
              {renderHTML(postContent)}
            </div>
            <div className={styles.link}>
              <Link href={`/posts/[id]`} as={`/posts/${id}`}>
                <a className="button button-primary">Read More</a>
              </Link>
            </div>
          </div>
        </div>
      )
    })
  }

  return <div>{renderPosts()}</div>
}

export default PostIndex
