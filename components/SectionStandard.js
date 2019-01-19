import React, { Component } from 'react'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import Link from 'next/link'

class SectionStandard extends Component {

  renderImage( imageSource ) {

    return (
      <div className="section-standard__image">
        <img src={ imageSource } />
      </div>
    )
  }


  renderRightImage( post, i ) {

    const { imageLeft, imageRight } = this.props

    if ( imageRight && !imageLeft ) {
      return this.renderImage( post.mainImage )
    } else if ( 
      ( ( !imageRight && !imageLeft ) ||
      ( imageRight && imageLeft ) ) &&
      i % 2 !== 0 && !!post.mainImage 
    ) {
      return this.renderImage( post.mainImage )
    }
  }


  renderLeftImage( post, i ) {

    const { imageLeft, imageRight } = this.props

    if ( imageLeft && !imageRight ) {
      return this.renderImage( post.mainImage )
    } else if ( 
      ( ( !imageRight && !imageLeft ) ||
      ( imageRight && imageLeft ) ) &&
      i % 2 === 0 && !!post.mainImage 
    ) {
      return this.renderImage( post.mainImage )
    }
  }
  
  
  renderContent( post ) {

    const { readMore } = this.props

    const contentLength = this.props.contentLength || 300
    let postContent = post.content.length >= contentLength ? `${post.content.substring( 0, contentLength).trim() } . . .` : post.content

    if ( readMore ) {
      return (
        <div>
          { renderHTML( postContent )}
          <Link href={`/posts/${post._id}`}>
            <a>Read More</a>
          </Link>
        </div>
      )
    } else {
      return renderHTML( post.content )
    }
  }


  renderPosts() {
    
    return _.map( this.props.posts, ( post, i ) => {
      const postTextClassName = !!post.mainImage ? 'section-standard__text' : 'section-standard__text--wide'

      return (
        <div className="section-standard__post" key={ post._id }>
          { this.renderLeftImage( post, i ) }
          <div className={ postTextClassName }>
            <h3 className="heading-tertiary">{ post.title }</h3>
            { this.renderContent( post ) }
          </div>
          { this.renderRightImage( post, i ) }
        </div>
      )
    })
  }


  render() {

    return (
      <div className={ `${ this.props.className } section-standard` }>
        <h2 className="heading-secondary u-margin-bottom-medium">{ this.props.title }</h2>

        {this.renderPosts()}
      </div>
    )
  }
}

export default SectionStandard
