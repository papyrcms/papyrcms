import React, { Component } from 'react'
import axios from 'axios'
import RichTextEditor from './RichTextEditor'
import Media from './Media'

class ProductsForm extends Component {

  constructor(props) {
    super(props)

    this.state = { imageUpload: false, uploadedImage: false, dots: '' }
  }


  renderPublish() {

    const { isAdminUser, publish, onPublishChange } = this.props

    if (isAdminUser) {
      return (
        <div className="post-form__publish">
          <input
            id="publish-checkbox"
            className="post-form__checkbox--input"
            type="checkbox"
            name="published"
            checked={publish}
            onChange={() => onPublishChange()}
          />
          <label htmlFor="publish-checkbox" className="post-form__label">Publish Product <span className="post-form__checkbox--span"></span></label>
        </div>
      )
    }
  }


  handleFileInputChange(event) {

    const { onMainImageChange } = this.props
    let imageChange = { target: { value: '' } }

    onMainImageChange(imageChange)
    this.setState({ uploadedImage: true })

    let formData = new FormData

    formData.append('file', event.target.files[0])

    axios.post('/api/upload', formData)
      .then(res => {
        imageChange.target.value = res.data
        onMainImageChange(imageChange)
      }).catch(err => {
        console.error(err.response)
      })
  }


  renderImageInput() {

    const { mainImage, onMainImageChange } = this.props

    if (this.state.imageUpload) {
      return (
        <div>
          <p>Please wait to submit the form until you see the image you uploaded to ensure it uploads properly.</p>
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


  renderDots() {

    const { uploadedImage, dots } = this.state

    if (uploadedImage && this.props.mainImage === '') {
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


  renderImage() {

    const { mainImage } = this.props


    if (this.state.uploadedImage && mainImage === '') {
      return <h3 className="heading-tertiary">Loading{this.renderDots()}</h3>
    } else {
      return (
        <Media
          className="post-form__image"
          src={mainImage}
        />
      )
    }
  }


  render() {

    const { title, tags, price, quantity, description, onTitleChange, onQuantityChange, onPriceChange, onDescriptionChange, handleSubmit } = this.props

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
              onChange={event => onTitleChange(event)}
            />
          </div>

          <div className="post-form__field">
            <label className="post-form__label">Tags</label>
            <input
              className="post-form__input"
              type="text"
              name="tags"
              value={tags}
              onChange={event => onTagsChange(event)}
            />
          </div>
        </div>

        <div className='post-form__top'>
          <div className="post-form__field">
            <label className="post-form__label">Price</label>
            <input
              className="post-form__input"
              type="number"
              name="price"
              step='.01'
              min='0'
              value={price}
              onChange={event => onPriceChange(event)}
            />
          </div>

          <div className="post-form__field">
            <label className="post-form__label">Quantity</label>
            <input
              className="post-form__input"
              type="number"
              name="quantity"
              step='1'
              min='0'
              value={quantity}
              onChange={event => onQuantityChange(event)}
            />
          </div>
        </div>

        <div className="post-form__label-section">
          <label className="post-form__label">Image</label>
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

        {this.renderImageInput()}
        {this.renderImage()}

        <label className="post-form__label">Description</label>
        <RichTextEditor
          className="post-form__text-editor"
          content={description}
          onChange={newDescription => onDescriptionChange(newDescription)}
        />

        <div className="post-form__bottom">
          {this.renderPublish()}
          <input className="button button-primary post-form__submit" type="submit" />
        </div>

      </form>
    )
  }
}


export default ProductsForm