import React, { useContext } from 'react'
import _ from 'lodash'
import Router from 'next/router'
import Form from './Form'
import postsContext from '@/context/postsContext'
import useForm from '@/hooks/useForm'


/**
 * PostsForm is an extendable form to be able to save and edit
 * posts of varying types
 *
 * @prop pageTitle: String - The title displayed above the form
 * @prop className: String - The wrapper class name for the form
 * @prop post: Object - The post being edited if editing
 * @prop onSubmit: Function - Event that happens after submitting
 * @prop apiEndpoint: String - The api endpoint to post/put the request to
 * @prop redirectRoute: String - The route to redirect to after submitting
 * @prop editing: Boolean - If the form is an edit form. This will use axios.put instead of axois.post
 * @prop additionalFields: Array[Component] - Additional form fields to render to the form
 * @prop additionalState: Object - Additional state data to accompany any additional fields
 */
const PostsForm = (props) => {

  const { posts, setPosts } = useContext(postsContext)

  const mapTagsToString = (tags) => {

    let newTags = ''

    _.forEach(tags, (tag, i) => {
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


  const handleSubmit = async (event, resetButton) => {
    event.preventDefault()

    const {
      apiEndpoint,
      redirectRoute,
      editing,
      onSubmit = (redirect) => Router.push(redirect)
    } = props

    const postRoute = apiEndpoint ? apiEndpoint : '/api/posts'
    const redirect = redirectRoute ? redirectRoute : '/posts'

    const success = (response, resetForm) => {
      let newPosts = []
      if (editing && post) {
        newPosts = _.map(posts, mappedPost => {
          if (mappedPost._id === post._id) return response.data
          return mappedPost
        })
      } else {
        newPosts = [...posts, response.data]
      }
      
      setPosts(newPosts)
      resetButton()
      resetForm()
      onSubmit(redirect)
    }

    const error = () => resetButton()

    await submitForm(postRoute, { success, error }, editing)
  }


  const { pageTitle, additionalFields, className } = props

  const additionalProps = {}

  if (additionalState) {
    _.forEach(additionalState, (state, key) => {
      additionalProps[key] = values[key]
    })
  }

  return (
    <div className={`post-form ${className}`}>
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


export default PostsForm
