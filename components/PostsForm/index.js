import React from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import Form from './Form'
import useForm from '../../hooks/useForm'


/**
 * PostsForm is an extendable form to be able to save and edit
 * posts of varying types
 *
 * @prop pageTitle: String - The title displayed above the form
 * @prop post: Object - The post being edited if editing
 * @prop apiEndpoint: String - The api endpoint to post/put the request to
 * @prop redirectRoute: String - The route to redirect to after submitting
 * @prop editing: Boolean - If the form is an edit form. This will use axios.put instead of axois.post
 * @prop additionalFields: Array[Component] - Additional form fields to render to the form
 * @prop additionalState: Object - Additional state data to accompany any additional fields
 */
const PostsForm = props => {

  const mapTagsToString = tags => {

    let newTags = ''

    tags.forEach((tag, i) => {
      if (i < tags.length - 1) {
        newTags = `${newTags}${tag}, `
      } else {
        newTags = `${newTags}${tag}`
      }
    })

    return newTags
  }


  const { post, additionalState } = props

  const INITIAL_STATE = {
    ...additionalState,
    title: post ? post.title : '',
    tags: post ? mapTagsToString(post.tags) : '',
    mainMedia: post ? post.mainMedia : '',
    content: post ? post.content : '',
    published: post ? post.published : false,
    validation: ''
  }
  const {
    values, handleChange, errors,
    validateField, submitForm
  } = useForm(INITIAL_STATE)


  const handleSubmit = event => {

    const { apiEndpoint, redirectRoute, editing } = props
    const postRoute = apiEndpoint ? apiEndpoint : '/api/posts'
    const redirect = redirectRoute ? redirectRoute : '/posts'

    const success = () => {
      Router.push(redirect)
    }

    submitForm(event, postRoute, { success }, editing)
  }


  const { pageTitle, additionalFields } = props

  const additionalProps = {}

  if (additionalState) {
    Object.keys(additionalState).forEach(key => {
      additionalProps[key] = values[key]
    })
  }

  return (
    <div className="post-form">
      <h2 className="heading-secondary">{pageTitle ? pageTitle : 'New Post'}</h2>
      <Form
        handleChange={handleChange}
        values={values}
        validateField={validateField}
        errors={errors}
        handleSubmit={handleSubmit}
        additionalFields={additionalFields}
      />
    </div>
  )
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default connect(mapStateToProps)(PostsForm)
