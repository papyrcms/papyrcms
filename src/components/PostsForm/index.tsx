import { Post } from '@/types'
import React, { useContext } from 'react'
import Router from 'next/router'
import Form from './Form'
import { postsContext } from '@/context'
import { useForm } from '@/hooks'
import styles from './PostsForm.module.scss'

type Props = {
  post?: Post
  pageTitle: string
  className?: string
  onSubmit?: Function
  apiEndpoint?: string
  redirectRoute?: string
  editing?: boolean
  additionalFields?: React.FC<any>[]
  additionalState?: { [key: string]: any }
}

const PostsForm: React.FC<Props> = (props) => {
  const { posts, setPosts } = useContext(postsContext)

  const mapTagsToString = (tags: string[]) => {
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
    media: post ? post.media : '',
    content: post ? post.content : '',
    isPublished: post ? post.isPublished : false,
    validation: '',
  }
  const {
    values,
    handleChange,
    errors,
    validateField,
    submitForm,
  } = useForm(INITIAL_STATE)

  const handleSubmit = async (event: any, resetButton: Function) => {
    event.preventDefault()

    const {
      apiEndpoint,
      redirectRoute,
      editing,
      onSubmit = (redirect: string) => Router.push(redirect),
    } = props

    const postRoute = apiEndpoint ? apiEndpoint : '/api/posts'
    const redirect = redirectRoute ? redirectRoute : '/posts'

    const success = (response: any, resetForm: Function) => {
      let newPosts = []
      if (editing && post) {
        newPosts = posts.map((mappedPost) => {
          if (mappedPost.id === post.id) return response.data
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
    Object.keys(additionalState).forEach((key) => {
      // @ts-ignore not sure how to handle this
      additionalProps[key] = values[key]
    })
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <h2 className="heading-secondary">
        {pageTitle ? pageTitle : 'New Post'}
      </h2>
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
