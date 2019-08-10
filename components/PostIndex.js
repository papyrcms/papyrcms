import React, { Component } from 'react'
import renderHTML from 'react-render-html'
import Link from 'next/link'
import Media from './Media'

class PostIndex extends Component {

  renderTags(tags) {

    return tags.map((tag, i) => {
      if (i < tags.length - 1) {
        return <span key={tag}>{tag}, </span>
      } else {
        return <span key={tag}>{tag}</span>
      }
    })
  }


  renderTagsSection(tags) {

    if (!!tags[0]) {
      return <p className="post-item__tags">Tags: <em>{this.renderTags(tags)}</em></p>
    }
  }


  renderMediaSection(media) {
    if (!!media) {
      return (
        <div className="post-item__image">
          <Media src={media} />
        </div>
      )
    }
  }


  renderPublishSection(published) {

    if (!published) {
      return <p><em>Not published</em></p>
    }

    return null
  }


  renderPosts() {

    const { posts } = this.props

    if (!!posts && !!posts[0]) {

      return Object.keys(posts).map(key => {
        const post = posts[key]
        const { _id, title, tags, mainMedia, content, published } = post

        let postContent = ''
        if (content) {
          postContent = content.length >= 200 ? `${content.substring(0, 200).trim()} . . .` : content
        }

        return (
          <div key={_id} className="post-item">
            {this.renderMediaSection(mainMedia)}
            <div className="post-item__details">
              <div className="post-item__top">
                <h3 className="post-item__title heading-tertiary">{title}</h3>
                {this.renderTagsSection(tags)}
                {this.renderPublishSection(published)}
              </div>
              <div className="post-item__content">
                {renderHTML(postContent)}
              </div>
              <div className="post-item__link">
                <Link href={`/posts_show?id=${_id}`} as={`/posts/${_id}`}>
                  <button className="button button-primary">Read More</button>
                </Link>
              </div>
            </div>
          </div>
        )
      })
    } else {
      return <h3 className="heading-tertiary">Nothing published yet</h3>
    }
  }


  render() {

    return <div className="post-index">{this.renderPosts()}</div>
  }
}


export default PostIndex
