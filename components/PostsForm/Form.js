import React, { Component } from 'react'
import axios from 'axios'
import _ from 'lodash'
import RichTextEditor from '../RichTextEditor'
import Media from '../Media'

class Form extends Component {

  constructor(props) {

    super(props)

    this.state = { mediaUpload: false, uploadedMedia: false, dots: '' }
  }


  renderPublish() {

    const { isAdminUser, publish, changeState } = this.props

    if (isAdminUser) {
      return (
        <div className="post-form__publish">
          <input
            id="publish-checkbox"
            className="post-form__checkbox--input"
            type="checkbox"
            name="published"
            checked={publish}
            onChange={() => changeState(!publish, 'publish')}
          />
          <label htmlFor="publish-checkbox" className="post-form__label">Publish Post <span className="post-form__checkbox--span"></span></label>
        </div>
      )
    }
  }


  handleFileInputChange(event) {

    const { changeState } = this.props

    changeState('', 'mainMedia')
    this.setState({ uploadedMedia: true })

    let formData = new FormData

    formData.append('file', event.target.files[0])

    axios.post('/api/upload', formData)
      .then(res => {
        changeState(res.data, 'mainMedia')
      }).catch(err => {
        console.error(err.response)
      })
  }


  renderMediaInput() {

    const { mainMedia, changeState } = this.props

    if (this.state.mediaUpload) {
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
          value={mainMedia}
          onChange={event => changeState(event.target.value, 'mainMedia')}
        />
      )
    }
  }


  renderDots() {

    const { uploadedMedia, dots } = this.state

    if (uploadedMedia && this.props.mainMedia === '') {
      setTimeout(() => {
        switch (dots) {
          case ' .':
            this.setState({ dots: ' . .' })
            break
          case ' . .':
            this.setState({ dots: ' . . .' })
            break
          default:
            this.setState({ dots: ' .' })
            break
        }
      }, 700)
    }

    return dots
  }


  renderMedia() {

    const { mainMedia } = this.props


    if (this.state.uploadedMedia && mainMedia === '') {
      return <h3 className="heading-tertiary">Loading{this.renderDots()}</h3>
    } else {
      return (
        <Media
          className="post-form__image"
          src={mainMedia}
        />
      )
    }
  }


  renderAdditionalFields() {

    const { additionalFields, changeState } = this.props

    if (additionalFields) {
      return _.map(additionalFields, Field => {
        return <Field key="" changeState={changeState} />
      })
    } else {
      return null
    }
  }


  render() {

    const { title, tags, content, changeState, handleSubmit } = this.props

    return (
      <form encType="multipart/form-data" className="post-form" onSubmit={handleSubmit.bind(this)}>

        <div className='post-form__top'>
          <div className="post-form__field">
            <label className="post-form__label">Title</label>
            <input
              className="post-form__input"
              type="text"
              name="title"
              value={title}
              onChange={event => changeState(event.target.value, 'title')}
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
              value={tags}
              onChange={event => changeState(event.target.value, 'tags')}
            />
          </div>
        </div>

        <div className="post-form__label-section">
          <label className="post-form__label">Media</label>
          <span>
            <input
              type="radio"
              name="image"
              checked={this.state.mediaUpload ? false : true}
              onChange={() => this.setState({ mediaUpload: false })}
            />
            <label htmlFor="image-url">URL</label>
          </span>
          <span>
            <input
              type="radio"
              name="image"
              checked={this.state.mediaUpload ? true : false}
              onChange={() => this.setState({ mediaUpload: true })}
            />
            <label htmlFor="image-upload">Upload</label>
          </span>
        </div>

        {this.renderAdditionalFields()}

        {this.renderMediaInput()}
        {this.renderMedia()}

        <label className="post-form__label">Content</label>
        <RichTextEditor
          className="post-form__text-editor"
          content={content}
          onChange={newContent => changeState(newContent, 'content')}
        />

        <div className="post-form__bottom">
          {this.renderPublish()}
          <input className="button button-primary post-form__submit" type="submit" />
        </div>

      </form>
    )
  }
}


export default Form