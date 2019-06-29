import React, { Component } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { connect } from 'react-redux'
import Router from 'next/router'
import ProductsForm from '../components/ProductsForm'

class StoreCreate extends Component {

  constructor(props) {

    super(props)

    this.state = {
      title: '',
      price: 0.00,
      stock: 0,
      tags: '',
      mainMedia: '',
      description: '',
      publish: false
    }
  }


  handleSubmit(event) {

    event.preventDefault()

    const { title, price, quantity, tags, mainMedia, description, publish } = this.state
    let tagArray = []

    _.map(tags.split(','), tag => {
      let pendingTag = tag
      pendingTag = pendingTag.trim()

      if (!!pendingTag) {
        tagArray.push(pendingTag)
      }
    })

    const productObject = {
      title,
      price,
      quantity,
      tags: tagArray,
      mainMedia,
      description,
      published: publish
    }

    axios.post('/api/products', productObject)
      .then(response => {
        Router.push('/store')
      }).catch(error => {
        console.error(error)
      })
  }


  renderForm() {

    const { title, tags, price, quantity, mainMedia, description, publish } = this.state

    return (
      <div className="products-create-page">
        <h2 className="heading-secondary">New Product</h2>
        <ProductsForm
          isAdminUser={this.props.currentUser.isAdmin}
          title={title}
          onTitleChange={event => this.setState({ title: event.target.value })}
          price={price}
          onPriceChange={event => this.setState({ price: event.target.value })}
          quantity={quantity}
          onQuantityChange={event => this.setState({ quantity: event.target.value })}
          tags={tags}
          onTagsChange={event => this.setState({ tags: event.target.value })}
          mainMedia={mainMedia}
          onMainMediaChange={event => this.setState({ mainMedia: event.target.value })}
          description={description}
          onDescriptionChange={newDescription => this.setState({ description: newDescription })}
          publish={publish}
          onPublishChange={() => this.setState({ publish: !publish })}
          handleSubmit={event => this.handleSubmit(event)}
        />
      </div>
    )
  }


  render() {

    return this.renderForm()
  }
}


const mapStateToProps = state => {
  return { settings: state.settings, currentUser: state.currentUser }
}


export default connect(mapStateToProps)(StoreCreate)
