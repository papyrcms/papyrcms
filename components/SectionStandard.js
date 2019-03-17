import React, { Component } from 'react'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import Link from 'next/link'
import Media from './Media'

class SectionStandard extends Component {

  renderMedia( mediaSource ) {

    return (
      <div className="section-standard__image">
        <Media src={ mediaSource } />
      </div>
    )
  }


  renderRightMedia( post, i ) {

    const { mediaLeft, mediaRight } = this.props

    if ( mediaRight && !mediaLeft ) {
      return this.renderMedia( post.mainMedia )
    } else if ( 
      ( ( !mediaRight && !mediaLeft ) ||
      ( mediaRight && mediaLeft ) ) &&
      i % 2 !== 0 && !!post.mainMedia 
    ) {
      return this.renderMedia( post.mainMedia )
    }
  }


  renderLeftMedia( post, i ) {

    const { mediaLeft, mediaRight } = this.props

    if ( mediaLeft && !mediaRight ) {
      return this.renderMedia( post.mainMedia )
    } else if ( 
      ( ( !mediaRight && !mediaLeft ) ||
      ( mediaRight && mediaLeft ) ) &&
      i % 2 === 0 && !!post.mainMedia 
    ) {
      return this.renderMedia( post.mainMedia )
    }
  }
  
  
  renderContent( post ) {

    const { readMore, path } = this.props

    const contentLength = this.props.contentLength || 300
    let postContent = post.content.length >= contentLength ? `${post.content.substring( 0, contentLength).trim() } . . .` : post.content

    if ( readMore ) {
      return (
        <div>
          { renderHTML( postContent )}
          <Link href={`/${path}_show?id=${post._id}`} as={`/${path}/${post._id}`}>
            <a>Read More</a>
          </Link>
        </div>
      )
    } else {
      return renderHTML( post.content )
    }
  }


  renderPosts() {

    const { path, posts } = this.props

    if (posts.length !== 0) {
      return _.map( posts, ( post, i ) => {
        const postTextClassName = !!post.mainMedia ? 'section-standard__text' : 'section-standard__text--wide'

        return (
          <div className="section-standard__post" key={ post._id }>
            { this.renderLeftMedia( post, i ) }
            <div className={ postTextClassName }>
              <h3 className="heading-tertiary">{ post.title }</h3>
              { this.renderContent( post ) }
            </div>
            { this.renderRightMedia( post, i ) }
          </div>
        )
      })
    } else {
      return <h3 className="heading-tertiary">There are no {path}s yet.</h3>
    }
  }


  render() {

    const { className, title } = this.props

    return (
      <div className={ `${className} section-standard` }>
        <h2 className="heading-secondary u-margin-bottom-medium">{ title }</h2>

        {this.renderPosts()}
      </div>
    )
  }
}

export default SectionStandard
