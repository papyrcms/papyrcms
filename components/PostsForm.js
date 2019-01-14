import React, { Component } from 'react'
import RichTextEditor from './RichTextEditor'

class PostForm extends Component {

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
      );
    }
  }


  render() {

    const { title, tags, mainImage, content, onTitleChange, onTagsChange, onMainImageChange, onContentChange, handleSubmit } = this.props;

    return (
      <form className="post-form" onSubmit={ handleSubmit.bind( this ) }>

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

        <label className="post-form__label">Main Image URL</label>
        <input
          className="post-form__input"
          type="text"
          name="image"
          value={ mainImage }
          onChange={ event => onMainImageChange( event ) }
        />

        <img className={ `post-form__image ${mainImage === '' ? 'u-no-margin' : ''}` } src={ mainImage } />

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