import React from 'react'
import renderHTML from 'react-render-html'
import Link from 'next/link'
import _ from 'lodash'
import Media from './Media'

type Props = {
  posts: Array<Post>
}

const PostIndex = (props: Props) => {

  const renderTags = (tags: Array<string>) => {
    return _.map(tags, (tag, i) => {
      if (i < tags.length - 1) {
        return <span key={tag}>{tag}, </span>
      } else {
        return <span key={tag}>{tag}</span>
      }
    })
  }


  const renderTagsSection = (tags: Array<string>) => {
    if (tags[0]) {
      return <p className="post-item__tags">Tags: <em>{renderTags(tags)}</em></p>
    }
  }


  const renderMediaSection = (media: string) => {
    if (media) {
      return (
        <div className="post-item__image">
          <Media src={media} />
        </div>
      )
    }
  }


  const renderPublishSection = (published: boolean) => {
    if (!published) {
      return <p><em>Not published</em></p>
    }
  }


  const renderPosts = () => {

    const { posts } = props

    if (!posts || !posts[0]) {
      return <h3 className="heading-tertiary">Nothing published yet</h3>
    }

    return _.map(posts, post => {

      const { _id, title, tags, mainMedia, content, published } = post

      let postContent = ''
      if (content) {
        postContent = content.length >= 200 ? `${content.substring(0, 200).trim()} . . .` : content
      }

      return (
        <div key={_id} className="post-item">
          {renderMediaSection(mainMedia)}
          <div className="post-item__details">
            <div className="post-item__top">
              <h3 className="post-item__title heading-tertiary">{title}</h3>
              {renderTagsSection(tags)}
              {renderPublishSection(published)}
            </div>
            <div className="post-item__content">
              {renderHTML(postContent)}
            </div>
            <div className="post-item__link">
              <Link href={`/posts/[id]`} as={`/posts/${_id}`}>
                <button className="button button-primary">Read More</button>
              </Link>
            </div>
          </div>
        </div>
      )
    })
  }


  return <div className="post-index">{renderPosts()}</div>
}


export default PostIndex
