import { Page, Post } from '@/types'
import Router from 'next/router'
import Form from './Form'
import { usePosts, useSectionOptions } from '@/context'
import { useForm } from '@/hooks'
import PageRenderer from '../../pages/[page]'
import styles from './PostsForm.module.scss'
import { useState } from 'react'

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

const MOCK_PAGE: Page = {
  sections: [
    {
      type: 'Standard',
      postType: 'post',
      tags: [],
      title: 'Preview',
      maxPosts: 1,
      className: '',
      order: 1,
      pageId: 'fakepageid',
      id: 'fakeid',
    },
  ],
  className: '',
  route: '',
  css: '',
  omitDefaultFooter: false,
  omitDefaultHeader: false,
  id: 'fakeid',
  updatedAt: new Date(),
  createdAt: new Date(),
  title: '',
  navOrder: 0,
}

const PostsForm: React.FC<Props> = (props) => {
  const { posts, setPosts } = usePosts()
  const { sectionOptions } = useSectionOptions()

  const { post, additionalState } = props

  const INITIAL_STATE = {
    ...additionalState,
    title: post ? post.title : '',
    tags: post ? post.tags.join(', ') : '',
    media: post ? post.media : '',
    content: post ? post.content : '',
    isPublished: post ? post.isPublished : false,
    validation: '',
  }
  const { values, handleChange, errors, validateField, submitForm } =
    useForm(INITIAL_STATE)
  const [previewSection, setPreviewSection] = useState('Standard')

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

  const additionalProps: any = {}

  if (additionalState) {
    Object.keys(additionalState).forEach((key) => {
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
      <br />
      <hr />
      <br />
      <select
        value={previewSection}
        onChange={(event) => setPreviewSection(event.target.value)}
      >
        {Object.keys(sectionOptions).map((key) => {
          return (
            <option key={key} value={key}>
              {key}
            </option>
          )
        })}
      </select>
      <PageRenderer
        previewPage={{
          ...MOCK_PAGE,
          sections: [
            { ...MOCK_PAGE.sections[0], type: previewSection },
          ],
        }}
        mockPosts={[
          {
            ...values,
            id: 'test',
            tags: values.tags.split(',').map((s: string) => s.trim()),
          } as Post,
        ]}
      />
    </div>
  )
}

export default PostsForm
