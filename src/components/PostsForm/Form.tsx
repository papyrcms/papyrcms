import React, { useState } from 'react'
import axios from 'axios'
import _ from 'lodash'
import RichTextEditor from '../RichTextEditor'
import Media from '../Media'
import Input from '../Input'
import Button from '../Button'

type FieldProps = {
  values: { [key: string]: any }
  handleChange: Function
  errors: { [key: string]: any }
  validateField: Function
}

type Props = {
  additionalFields?: React.FC<FieldProps>[]
  values: { [key: string]: any }
  handleChange: Function
  errors: { [key: string]: any }
  validateField: Function
  handleSubmit: Function
}

const Form: React.FC<Props> = (props) => {
  const {
    values,
    handleChange,
    errors,
    validateField,
    additionalFields,
    handleSubmit,
  } = props
  const [mediaUpload, setMediaUpload] = useState(false)
  const [uploadedMedia, setUploadedMedia] = useState(false)
  const [dots, setDots] = useState('')

  const renderPublish = () => (
    <div className="post-form__publish">
      <input
        id="publish-checkbox"
        className="post-form__checkbox--input"
        type="checkbox"
        name="published"
        checked={values.published}
        onChange={(event) =>
          handleChange({
            target: { name: 'published', value: !values.published },
          })
        }
      />
      <label htmlFor="publish-checkbox" className="post-form__label">
        Publish Post{' '}
        <span className="post-form__checkbox--span"></span>
      </label>
    </div>
  )

  const handleFileInputChange = (event: any) => {
    if (!event.target.files) return

    handleChange({ target: { value: '', name: 'mainMedia' } })
    setUploadedMedia(true)

    let formData = new FormData()
    formData.append('file', event.target.files[0])

    axios
      .post('/api/utility/upload', formData)
      .then((res) => {
        const event = {
          target: { value: res.data, name: 'mainMedia' },
        }
        handleChange(event)
      })
      .catch((err) => {
        console.error(err.response)
      })
  }

  const renderMediaInput = () => {
    if (mediaUpload) {
      return (
        <div>
          <p>
            Please wait to submit the form until you see the media you
            uploaded to ensure it uploads properly.
          </p>
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
          name="mainMedia"
          value={values.mainMedia}
          onChange={handleChange}
        />
      )
    }
  }

  const renderDots = () => {
    if (uploadedMedia && !values.mainMedia) {
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
    if (uploadedMedia && !values.mainMedia) {
      return (
        <h3 className="heading-tertiary">Loading{renderDots()}</h3>
      )
    } else {
      return (
        <Media
          className="post-form__image"
          alt="Uploaded Image"
          src={values.mainMedia}
        />
      )
    }
  }

  const renderAdditionalFields = () => {
    if (additionalFields) {
      return _.map(additionalFields, (Field, i) => {
        return (
          <Field
            key={`field-${i}`}
            handleChange={handleChange}
            values={values}
            validateField={validateField}
            errors={errors}
          />
        )
      })
    }
  }

  return (
    <form encType="multipart/form-data" className="post-form__form">
      <div className="u-form-row">
        <Input
          id="post_title"
          label="Title"
          name="title"
          value={values.title}
          onChange={handleChange}
        />

        <Input
          id="post_tags"
          label="Tags"
          name="tags"
          placeholder="separated by a comma"
          value={values.tags}
          onChange={handleChange}
        />
      </div>

      <div className="post-form__label-section">
        <label className="post-form__label">Media</label>
        <span>
          <input
            type="radio"
            name="mediaUpload"
            checked={mediaUpload ? false : true}
            onChange={() => setMediaUpload(false)}
          />
          <label htmlFor="image-url">URL</label>
        </span>
        <span>
          <input
            type="radio"
            name="mediaUpload"
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
        content={values.content}
        name="content"
        onChange={handleChange}
      />

      <p className="post-form__validation">{values.validation}</p>

      <div className="post-form__bottom">
        {renderPublish()}
        <Button
          id="posts-form-submit"
          className="post-form__submit"
          submittedText="Saving..."
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </form>
  )
}

export default Form
