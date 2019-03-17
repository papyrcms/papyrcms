import React, { Component } from 'react'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import Link from 'next/link'
import Media from './Media'

class SectionCards extends Component {

  renderReadMore(post) {

    if (this.props.readMore) {
      const path = this.props.path ? this.props.path : 'posts'

      return (
        <Link href={`/${path}_show?id=${post._id}`} as={`/${path}/${post._id}`}>
          <a className="section-cards__link">Read More</a>
        </Link>
      )
    }
  }


  renderPosts() {

    const { path, posts, contentLength } = this.props

    if (posts.length !== 0) {

      // Set defaults for characterCount
      const characterCount = contentLength || 300

      return _.map(posts, post => {
        let postContent = post.content.length >= characterCount ? `${post.content.substring(0, characterCount).trim()} . . .` : post.content

        return (
          <li key={post._id} className="section-cards__card">
            <h3 className="section-cards__title">{post.title}</h3>
            <Media className="section-cards__image" src={post.mainMedia} />
            <div className="section-cards__content">{renderHTML(postContent)}</div>
            {this.renderReadMore(post)}
          </li>
        )
      })
    } else {
      return <h3 className="heading-tertiary">There are no {path}s yet.</h3>
    }
  }


  render() {

    const { perRow, title } = this.props
    const listCountClass = perRow ? `section-cards__list--${perRow}` : 'section-cards__list--3'

    return (
      <section className='section-cards'>
        <h2 className='heading-secondary section-cards__header'>{title}</h2>
        <ul className={`section-cards__list ${listCountClass}`}>
          {this.renderPosts()}
        </ul>
      </section>
    )
  }
}


export default SectionCards
