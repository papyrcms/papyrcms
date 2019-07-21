/**
 * PostsForm is an extendable form to be able to save and edit
 * posts of varying types
 * 
 * props include:
 *   pageTitle: String - The title displayed above the form
 *   post: Object - The post being edited if editing
 *   apiEndpoint: String - The api endpoint to post/put the request to
 *   redirectRoute: String - The route to redirect to after submitting
 *   editing: Boolean - If the form is an edit form. This will use axios.put instead of axois.post
 *   additionalFields: Array[Component] - Additional form fields to render to the form
 *   additionalState: Object - Additional state data to accompany any additional fields
 */

import React, { Component } from 'react'
import Router from 'next/router'
import axios from 'axios'
import _ from 'lodash'
import { connect } from 'react-redux'
import Form from './Form'

class PostsForm extends Component {

  constructor(props) {

    super(props)

    const { post, additionalState } = props

    this.state = {
      ...additionalState,
      title: post ? post.title || '' : '',
      tags: post ? this.mapTagsToString(post.tags) : '',
      mainMedia: post ? post.mainMedia || '' : '',
      content: post ? post.content || '' : '',
      publish: post ? post.published || false : false
    }
  }


  mapTagsToString(tags) {

    let newTags = ''

    _.map(tags, (tag, i) => {
      if (i < tags.length - 1) {
        newTags = `${newTags}${tag}, `
      } else {
        newTags = `${newTags}${tag}`
      }
    })

    return newTags
  }


  handleSubmit(event) {

    event.preventDefault()

    const { title, tags, mainMedia, content, publish } = this.state

    const { apiEndpoint, redirectRoute, editing, additionalState } = this.props

    const postObject = {
      title,
      tags,
      mainMedia,
      content,
      published: publish,
    }

    if (additionalState) {
      _.map(additionalState, (value, key) => {
        postObject[key] = this.state[key]
      })
    }

    // Remove unused properties
    _.map(postObject, (value, key) => {
      if (!value) {
        delete(postObject[key])
      }
    })

    const postRoute = apiEndpoint ? apiEndpoint : '/api/posts'
    const redirect = redirectRoute ? redirectRoute : '/posts'

    if ( editing ) {
      axios.put(postRoute, postObject)
        .then(response => {
          Router.push(redirect)
        }).catch(error => {
          console.error(error)
        })
    } else {
      axios.post(postRoute, postObject)
        .then(response => {
          Router.push(redirect)
        }).catch(error => {
          console.error(error)
        })
    }
  }


  changeState(value, stateItem) {

    this.setState({ [stateItem]: value })
  }


  render() {

    const { title, tags, mainMedia, content, publish } = this.state
    const { pageTitle, additionalFields, additionalState } = this.props

    const additionalProps = {}
    _.map(additionalState, (value, key) => {
      additionalProps[key] = this.state[key]
    })

    return (
      <div className="posts-create-page">
        <h2 className="heading-secondary">{pageTitle ? pageTitle : 'New Post'}</h2>
        <Form
          changeState={this.changeState.bind(this)}
          isAdminUser={this.props.currentUser.isAdmin}
          title={title}
          tags={tags}
          mainMedia={mainMedia}
          content={content}
          publish={publish}
          handleSubmit={this.handleSubmit.bind(this)}
          additionalFields={additionalFields}
          additionalState={additionalProps}
        />
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default connect(mapStateToProps)(PostsForm)
