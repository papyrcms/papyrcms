import React, { Component } from 'react'
import _ from 'lodash'
import renderHTML from 'react-render-html'

class SectionStandard extends Component {

  renderImage( imageSource ) {

    return (
      <div className="section-standard__image">
        <img src={ imageSource } />
      </div>
    )
  }


  renderEndImage( post, i ) {

    if ( i % 2 !== 0 && !!post.mainImage ) {
      return this.renderImage( post.mainImage )
    }
  }


  renderStartImage( post, i ) {

    if ( i % 2 === 0 && !!post.mainImage ) {
      return this.renderImage( post.mainImage )
    }
  }


  renderPosts() {

    return _.map( this.props.posts, ( post, i ) => {
      const postTextClassName = !!post.mainImage ? 'section-standard__text' : 'section-standard__text--wide'

      return (
        <div className="section-standard__post" key={ post._id }>
          { this.renderStartImage( post, i ) }
          <div className={ postTextClassName }>
            <h3 className="heading-tertiary">{ post.title }</h3>
            <div>
              { renderHTML( post.content ) }
            </div>
          </div>
          { this.renderEndImage( post, i ) }
        </div>
      );
    });
  }


  render() {

    return (
      <div className={ `${ this.props.className } section-standard` }>
        <h2 className="heading-secondary u-margin-bottom-medium">{ this.props.title }</h2>

        {this.renderPosts()}
      </div>
    );
  }
}

export default SectionStandard
