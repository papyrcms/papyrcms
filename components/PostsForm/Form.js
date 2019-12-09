import React, { useState } from 'react'
import axios from 'axios'
import RichTextEditor from '../RichTextEditor'
import Media from '../Media'
import Input from '../Input'

const Form = props => {

  const {
    isAdminUser, publish, additionalFields,
    changeState, additionalState, mainMedia,
    title, tags, content, handleSubmit, validationMessage
  } = props
  const [mediaUpload, setMediaUpload] = useState(false)
  const [uploadedMedia, setUploadedMedia] = useState(false)
  const [dots, setDots] = useState('')


  const renderPublish = () => {
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


  const handleFileInputChange = event => {

    changeState('', 'mainMedia')
    setUploadedMedia(true)

    let formData = new FormData
    formData.append('file', event.target.files[0])

    axios.post('/api/upload', formData)
      .then(res => {
        changeState(res.data, 'mainMedia')
      }).catch(err => {
        console.error(err.response)
      })
  }


  const renderMediaInput = () => {
    if (mediaUpload) {
      return (
        <div>
          <p>Please wait to submit the form until you see the media you uploaded to ensure it uploads properly.</p>
          <input
            className="post-form__input"
            type="file"
            name="file"
            onChange={handleFileInputChange}
          />
        </div>
      )
    } else {
      return (
        <Input
          name="image"
          value={mainMedia}
          onChange={event => changeState(event.target.value, 'mainMedia')}
        />
      )
    }
  }


  const renderDots = () => {
    if (uploadedMedia && mainMedia === '') {
      setTimeout(() => {
        switch (dots) {
          case ' .':
            setDots(' . .')
            break
          case ' . .':
            setDots(' . . .')
            break
          default:
            setDots(' .')
            break
        }
      }, 700)
    }

    return dots
  }


  const renderMedia = () => {
    if (uploadedMedia && mainMedia === '') {
      return <h3 className="heading-tertiary">Loading{renderDots()}</h3>
    } else {
      return (
        <Media
          className="post-form__image"
          src={mainMedia}
        />
      )
    }
  }


  const renderAdditionalFields = () => {
    if (additionalFields) {
      return additionalFields.map((Field, i) => {
        return <Field key={`field-${i}`} changeState={changeState} {...additionalState} />
      })
    }
  }


  return (
    <form encType="multipart/form-data" className="post-form__form" onSubmit={handleSubmit}>

      <div className='post-form__top'>
        <Input
          id="post_title"
          label="Title"
          name="title"
          value={title}
          onChange={event => changeState(event.target.value, 'title')}
        />

        <Input
          id="post_tags"
          label="Tags"
          name="tags"
          placeholder="separated by a comma"
          value={tags}
          onChange={event => changeState(event.target.value, 'tags')}
        />
      </div>

      <div className="post-form__label-section">
        <label className="post-form__label">Media</label>
        <span>
          <input
            type="radio"
            name="image"
            checked={mediaUpload ? false : true}
            onChange={() => setMediaUpload(false)}
          />
          <label htmlFor="image-url">URL</label>
        </span>
        <span>
          <input
            type="radio"
            name="image"
            checked={mediaUpload ? true : false}
            onChange={() => setMediaUpload(true)}
          />
          <label htmlFor="image-upload">Upload</label>
        </span>
      </div>

      {renderMediaInput()}
      {renderMedia()}
      {renderAdditionalFields()}

      <label className="post-form__label">Content</label>
      <RichTextEditor
        className="post-form__text-editor"
        content={content}
        onChange={newContent => changeState(newContent, 'content')}
      />

      <p className="post-form__validation">{validationMessage}</p>

      <div className="post-form__bottom">
        {renderPublish()}
        <input className="button button-primary post-form__submit" type="submit" />
      </div>

    </form>
  )
}


export default Form