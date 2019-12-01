import React, { Component } from 'react'
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
class SectionCards extends Component {

  renderReadMore(post) {

    if (this.props.readMore) {
      const path = this.props.path ? this.props.path : 'posts'

      return (
        <Link href={`/${path || 'posts'}_show?id=${post._id}`} as={`/${path || 'posts'}/${post.slug || post._id}`}>
          <a className="section-cards__link">Read More</a>
        </Link>
      )
    }
  }


  renderInfoProps(post) {

    const { infoProps } = this.props

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

    return null
  }


  renderPublishSection(published) {

    if (!published) {
      return <p><em>Not published</em></p>
    }

    return null
  }


  renderDate(post) {

    if (this.props.showDate) {

      const date = post.published && post.publishDate
        ? post.publishDate
        : post.created

      return <p>{moment(date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
    }

    return null
  }


  renderMediaSection(post) {

    if (!post.mainMedia) {
      return null
    }

    return <Media 
      className="section-cards__image" 
      src={post.mainMedia} 
      alt={post.title} 
      clickable={this.props.clickableMedia}
    />
  }


  renderPosts() {

    const { posts, contentLength, emptyMessage } = this.props

    if (posts.length !== 0) {

      // Set defaults for characterCount
      const characterCount = contentLength || 300

      return posts.map(post => {

        let postContent = post.content.length >= characterCount ? `${post.content.substring(0, characterCount).trim()} . . .` : post.content

        return (
          <li key={post._id} className="section-cards__card">
            <h3 className="section-cards__title heading-tertiary">{post.title}</h3>
            {this.renderDate(post)}
            {this.renderPublishSection(post.published)}
            {this.renderMediaSection(post)}
            {this.renderInfoProps(post)}
            <div className="section-cards__content">{renderHTML(postContent)}</div>
            {this.renderReadMore(post)}
          </li>
        )
      })
    } else {
      return (
        <div className="section-cards__empty-message">
          <h3 className="heading-tertiary">{emptyMessage ? emptyMessage : ''}</h3>
        </div>
      )
    }
  }


  render() {

    const { perRow, title } = this.props
    const listCountClass = perRow ? `section-cards__list--${perRow}` : 'section-cards__list--3'

    return (
      <section className='section-cards'>
        <div className="section-cards__container">
          <h2 className='heading-secondary section-cards__header'>{title}</h2>
          <ul className={`section-cards__list ${listCountClass}`}>
            {this.renderPosts()}
          </ul>
        </div>
      </section>
    )
  }
}


export default SectionCards
