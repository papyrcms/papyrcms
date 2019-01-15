import React, { Component } from 'react'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import Link from 'next/link'

class PostIndex extends Component {

  renderTags( tags ) {

    return _.map( tags, ( tag, i ) => {
      if ( i < tags.length - 1 ) {
        return <span key={tag}>{tag}, </span>
      } else {
        return <span key={tag}>{tag}</span>
      }
    })
  }


  renderTagsSection( tags ) {

    if ( !!tags[0] ) {
      return <p className="post-item__tags">Tags: <em>{ this.renderTags( tags ) }</em></p>
    }
  }


  renderImageSection( image ) {

    if ( !!image ) {
      return (
        <div className="post-item__image">
          <img src={ image } />
        </div>
      )
    }
  }


  renderPosts() {

    const { posts } = this.props

    if ( !!posts && !!posts[0] ) {
      return _.map( posts, post => {
        const { _id, title, tags, mainImage, content } = post

        return (
          <div key={ _id } className="post-item">
            { this.renderImageSection( mainImage ) }
            <div className="post-item__details">
              <div className="post-item__top">
                <h3 className="post-item__title heading-tertiary">{ title }</h3>
                { this.renderTagsSection( tags ) }
              </div>
              <div className="post-item__content">
                { renderHTML( content.length >= 200 ? `${content.substring( 0, 200 ).trim()} . . .` : content ) }
              </div>
              <div className="post-item__link">
                <Link href={ `/posts_show?id=${_id}` } as={ `/posts/${_id}` }>
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

    return <div className="post-index">{ this.renderPosts() }</div>
  }
}


export default PostIndex
