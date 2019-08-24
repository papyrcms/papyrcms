/**
 * SectionStandard will render Posts in a more horizontal style
 * 
 * props include:
 *   title: String - The title to display above the cards
 *   readMore: Boolean - If true, a link to the full post will render at the bottom of each card
 *   path: String - The path to use for the read more link before the post id ('/{path}/a1s2d3f4g5h6j7')
 *   contentLength: String - How many characters to show in the card content
 *   emptyMessage: String - Message to display if there are no posts
 *   posts: Array [Object - The post to be rendered as a card]
 *   showDate: String - The post date prop to show
 *   clickableMedia: Boolean - If true, the media will display as a modal when clicked
 */


import React, { Component } from 'react'
import renderHTML from 'react-render-html'
import Link from 'next/link'
import moment from 'moment-timezone'
import Media from '../Media'


class SectionStandard extends Component {

  renderMedia(post) {

    if (!post.mainMedia) {
      return null
    }

    return <Media 
      className="section-standard__image"
      src={post.mainMedia} 
      alt={post.title} 
      clickable={this.props.clickableMedia}
    />
  }


  renderRightMedia(post, i) {

    const { mediaLeft, mediaRight } = this.props

    if (mediaRight && !mediaLeft) {
      return this.renderMedia(post)
    } else if (
      ((!mediaRight && !mediaLeft) ||
        (mediaRight && mediaLeft)) &&
      i % 2 !== 0 && !!post.mainMedia
    ) {
      return this.renderMedia(post)
    }
  }


  renderLeftMedia(post, i) {

    const { mediaLeft, mediaRight } = this.props

    if (mediaLeft && !mediaRight) {
      return this.renderMedia(post)
    } else if (
      ((!mediaRight && !mediaLeft) ||
        (mediaRight && mediaLeft)) &&
      i % 2 === 0 && !!post.mainMedia
    ) {
      return this.renderMedia(post)
    }
  }


  renderContent(post) {

    const { readMore, path } = this.props

    const contentLength = this.props.contentLength || 300
    let postContent = post.content.length >= contentLength ? `${post.content.substring(0, contentLength).trim()} . . .` : post.content

    if (readMore) {
      return (
        <div>
          {renderHTML(postContent)}
          <Link href={`/${path || 'posts'}_show?id=${post._id}`} as={`/${path || 'posts'}/${post._id}`}>
            <a>Read More</a>
          </Link>
        </div>
      )
    } else {
      return renderHTML(post.content)
    }
  }


  renderDate(post) {

    const { showDate } = this.props

    if (showDate) {

      const date = post[showDate] ? post[showDate] : post.created

      return <p>{moment(date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
    }

    return null
  }


  renderPosts() {

    const { emptyMessage, posts } = this.props

    if (posts.length !== 0) {

      return posts.map((post, i) => {

        const postTextClassName = !!post.mainMedia ? 'section-standard__text' : 'section-standard__text--wide'

        return (
          <div className="section-standard__post" key={post._id}>
            {this.renderLeftMedia(post, i)}
            <div className={postTextClassName}>
              <h3 className="heading-tertiary">{post.title}</h3>
              {this.renderDate(post)}
              {this.renderContent(post)}
            </div>
            {this.renderRightMedia(post, i)}
          </div>
        )
      })
    } else {
      return  <h3 className="heading-tertiary">{emptyMessage ? emptyMessage : ''}</h3>
    }
  }


  render() {

    const { className, title } = this.props

    return (
      <section className={`${className || ''} section-standard`}>
        <div className="section-standard__container">
          <h2 className="heading-secondary u-margin-bottom-medium">{title}</h2>

          {this.renderPosts()}
        </div>
      </section>
    )
  }
}

export default SectionStandard
