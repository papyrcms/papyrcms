import React, { Component } from 'react'
import axios from 'axios'
import RichTextEditor from './RichTextEditor'

class PostForm extends Component {

  constructor( props ) {
    super( props )

    this.state = { imageUpload: false }
  }


  renderPublish() {

    const { isAdminUser, publish, onPublishChange } = this.props

    if ( isAdminUser ) {
      return (
        <div className="post-form__publish">
          <input
            id="publish-checkbox"
            className="post-form__checkbox--input"
            type="checkbox"
            name="published"
            checked={ publish }
            onChange={ () => onPublishChange() }
          />
          <label htmlFor="publish-checkbox" className="post-form__label">Publish Post <span className="post-form__checkbox--span"></span></label>
        </div>
      )
    }
  }


  handleFileInputChange( event ) {

    const { onMainImageChange } = this.props
    let formData = new FormData

    formData.append( 'file', event.target.files[0] )

    axios.post( '/api/upload', formData )
      .then( res => {

        const imageChange = { target: { value: res.data } }
        onMainImageChange( imageChange )
      }).catch( err => {
        console.log( err.response )
      })
  }


  renderImageInput() {

    const { mainImage, onMainImageChange } = this.props

    if ( this.state.imageUpload ) {
      return (
        <div>
          <p>Please wait to submit the form until you see the media you uploaded to ensure it uploads properly.</p>
          <input
            className="post-form__input"
            type="file"
            name="file"
            onChange={event => this.handleFileInputChange(event)}
          />
        </div>
      )
    } else {
      return (
        <input
          className="post-form__input"
          type="text"
          name="image"
          value={mainImage}
          onChange={event => onMainImageChange(event)}
        />
      )
    }
  }


  renderImage() {

    const { mainImage } = this.props

    if ( mainImage.match(/\.(jpg|jpeg|png|gif)$/i) ) {
      return (
        <img 
          className="post-form__image" 
          src={mainImage}
        />
      )
    } else if( mainImage.match(/\.(mp4|webm)$/i) ) {
      return (
        <video className="post-form__image" autoPlay muted loop>
          <source src={mainImage} type="video/mp4" />
          <source src={mainImage} type="video/webm" />
          Your browser is not supported.
        </video>
      )
    }
  }


  render() {

    const { title, tags, content, onTitleChange, onTagsChange, onContentChange, handleSubmit } = this.props

    return (
      <form encType="multipart/form-data" className="post-form" onSubmit={ handleSubmit.bind( this ) }>

        <div className='post-form__top'>
          <div className="post-form__field">
            <label className="post-form__label">Title</label>
            <input
              className="post-form__input"
              type="text"
              name="title"
              value={ title }
              onChange={ event => onTitleChange( event ) }
            />
          </div>

          <div className="post-form__field">
            <label className="post-form__label">
              Tags
            </label>
            <input
              className="post-form__input"
              placeholder="separated by a comma"
              type="text"
              name="tags"
              value={ tags }
              onChange={ event => onTagsChange( event ) }
            />
          </div>
        </div>

        <div className="post-form__label-section">
          <label className="post-form__label">Media</label>
          <span>
            <input
              type="radio"
              name="image"
              checked={this.state.imageUpload ? false : true}
              onChange={() => this.setState({ imageUpload: false })}
            />
            <label htmlFor="image-url">URL</label>
          </span>
          <span>
            <input
              type="radio"
              name="image"
              checked={this.state.imageUpload ? true : false}
              onChange={() => this.setState({ imageUpload: true })}
            />
            <label htmlFor="image-upload">Upload</label>
          </span>
        </div>

        { this.renderImageInput() }
        { this.renderImage() }

        <label className="post-form__label">Content</label>
        <RichTextEditor
          className="post-form__text-editor"
          content={ content }
          onChange={ newContent => onContentChange( newContent ) }
        />

        <div className="post-form__bottom">
          { this.renderPublish() }
          <input className="button button-primary post-form__submit" type="submit" />
        </div>

      </form>
    )
  }
}


export default PostForm