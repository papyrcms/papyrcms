import { Post, Comment, SectionOptions } from 'types'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import _ from 'lodash'
import Link from 'next/link'
import Router from 'next/router'
import renderHTML from 'react-render-html'
import userContext from '@/context/userContext'
import postsContext from '@/context/postsContext'
import settingsContext from '@/context/settingsContext'
import Media from '@/components/Media'
import PageHead from '@/components/PageHead'
import usePostFilter from '@/hooks/usePostFilter'

type Props = {
  posts?: Post[]
  enableCommenting?: boolean
  apiPath?: string
  className?: string
  redirectRoute?: string
  path?: string
  emptyTitle?: string
  emptyMessage?: string
  renderAuthButtons?: boolean

  // Hook functions
  beforePost?: Function
  afterPost?: Function
  beforeTitle?: Function
  afterTitle?: Function
  beforeMainMedia?: Function
  afterMainMedia?: Function
  beforeContent?: Function
  afterContent?: Function
  beforeComments?: Function
  afterComments?: Function
  beforeCommentForm?: Function
  afterCommentForm?: Function
}

/**
 * SectionStandard is the main component to show the details of an array of posts
 *
 * @prop posts - Array[Object] - The post that will be displayed on the page
 * @prop enableCommenting - Boolean - Whether or not users can comment on this post
 * @prop path - String - The prefix for accessing the edit page
 * @prop renderAuthButtons - Boolean - Whether or not to render auth buttons. Default true
 * @prop apiPath - String - The api prefix for CRUD operations
 * @prop redirectRoute - String - The route to redirect to after deleting the post
 * @prop className - String - Any additional classes to wrap the component
 * @prop emptyTitle - String - A title to display when there is no post passed
 * @prop emptyMessage - String - A message to display when there is no post passed
 *
 * Post Hooks
 * @prop beforePost - Function - Rendered before each post
 * @prop afterPost - Function - Rendered after each post
 * @prop beforeTitle - Function - Rendered before each post title
 * @prop afterTitle - Function - Rendered after each post title
 * @prop beforeMainMedia - Function - Rendered before each post main media
 * @prop afterMainMedia - Function - Rendered after each post main media
 * @prop beforeContent - Function - Rendered before each post content
 * @prop afterContent - Function - Rendered after each post content
 * @prop beforeComments - Function - Rendered before each post comments
 * @prop afterComments - Function - Rendered after each post comments
 * @prop beforeCommentForm - Function - Rendered before each post comment form
 * @prop afterCommentForm - Function - Rendered after each post comment form
 */
const SectionStandard: React.FC<Props> = (props) => {
  const { currentUser } = useContext(userContext)
  const { posts, setPosts } = useContext(postsContext)

  if (!props.posts) return null

  const {
    enableCommenting,
    apiPath,
    className,
    redirectRoute,
    path,
    emptyTitle,
    emptyMessage,
    renderAuthButtons = true,

    // Hook functions
    beforePost = () => null,
    afterPost = () => null,
    beforeTitle = () => null,
    afterTitle = () => null,
    beforeMainMedia = () => null,
    afterMainMedia = () => null,
    beforeContent = () => null,
    afterContent = () => null,
    beforeComments = () => null,
    afterComments = () => null,
    beforeCommentForm = () => null,
    afterCommentForm = () => null,
  } = props

  const onDeleteClick = (post: Post) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this post?'
    )

    if (confirm) {
      const deletePath = apiPath ? apiPath : '/api/posts'
      const deleteRedirect = redirectRoute ? redirectRoute : '/posts'

      axios
        .delete(`${deletePath}/${post._id}`)
        .then((res) => {
          const newPosts = _.filter(
            posts,
            (filtered) => filtered._id !== post._id
          )
          setPosts(newPosts)
          Router.push(deleteRedirect)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const renderAuthOptions = (post: Post) => {
    if (currentUser && currentUser.isAdmin && renderAuthButtons) {
      return (
        <div className="post__buttons">
          <button
            className="button button-delete"
            onClick={() => onDeleteClick(post)}
          >
            Delete
          </button>
          <Link
            href={`/${path}/[id]/edit`}
            as={`/${path}/${post._id}/edit`}
          >
            <button className="button button-edit">Edit</button>
          </Link>
        </div>
      )
    }
  }

  const renderTags = (post: Post) => {
    return _.map(post.tags, (tag, i) => {
      if (i < tags.length - 1) {
        return <span key={tag}>{tag}, </span>
      } else {
        return <span key={tag}>{tag}</span>
      }
    })
  }

  const renderTagsSection = (post: Post) => {
    if (
      post.tags &&
      post.tags[0] &&
      currentUser &&
      currentUser.isAdmin
    ) {
      return (
        <p className="post__tags">
          Tags: <em>{renderTags(post)}</em>
        </p>
      )
    }
  }

  const renderMainMedia = (post: Post) => {
    if (post.mainMedia) {
      return (
        <div className="post__image">
          <Media src={post.mainMedia} alt={post.title} />
        </div>
      )
    }
  }

  const renderPublishSection = (post: Post) => {
    if (!post.published) {
      return (
        <p>
          <em>Not published</em>
        </p>
      )
    }
  }

  const renderComments = (post: Post) => {
    return (
      <CommentComp
        post={post}
        comments={post.comments || []}
        enableCommenting={!!enableCommenting}
        apiPath={apiPath}
        beforeCommentForm={beforeCommentForm}
        afterCommentForm={afterCommentForm}
      />
    )
  }

  if (posts.length === 0 || Object.keys(posts).length == 0) {
    return (
      <div className={`posts-show ${className || ''}`}>
        <h2 className="heading-secondary">{emptyTitle}</h2>
        <h3 className="heading-tertiary">{emptyMessage}</h3>
      </div>
    )
  }

  const renderPosts = () => {
    return _.map(props.posts, (post) => {
      if (!post) return null
      return (
        <div key={post._id}>
          {beforePost(post)}

          <div className="post">
            {renderPublishSection(post)}

            {beforeTitle(post)}
            <h2 className="heading-secondary post__title u-margin-bottom-small">
              {post.title}
            </h2>
            {afterTitle(post)}

            {renderTagsSection(post)}

            {beforeMainMedia(post)}
            {renderMainMedia(post)}
            {afterMainMedia(post)}

            {beforeContent(post)}
            <div className="post__content">
              {renderHTML(post.content || '')}
            </div>
            {afterContent(post)}

            {renderAuthOptions(post)}

            {beforeComments(post)}
            {renderComments(post)}
            {afterComments(post)}
          </div>

          {afterPost(post)}
        </div>
      )
    })
  }

  const [{ title, tags, mainMedia, content }] = posts
  let postContent = content || ''

  let headTitle
  const headerSettings = {
    maxPosts: 1,
    postTags: ['section-header'],
  }
  const {
    posts: [headerPost],
  } = usePostFilter(posts, headerSettings)
  if (headerPost && title) {
    headTitle = `${headerPost.title} | ${title}`
  }

  return (
    <div className={`posts-show ${className || ''}`}>
      <PageHead
        title={headTitle}
        image={mainMedia}
        description={postContent
          .replace('<p>', '')
          .replace('</p>', '')}
        keywords={tags.toString()}
      />

      {renderPosts()}
    </div>
  )
}

type CommentProps = {
  comments: Comment[]
  enableCommenting?: boolean
  post: Post
  apiPath?: string
  beforeCommentForm?: Function
  afterCommentForm?: Function
}

const CommentComp: React.FC<CommentProps> = (props) => {
  const {
    enableCommenting,
    post,
    apiPath,
    beforeCommentForm = () => null,
    afterCommentForm = () => null,
  } = props

  const { settings } = useContext(settingsContext)
  const { currentUser } = useContext(userContext)

  const [formContent, setFormContent] = useState('')
  const [comments, setComments] = useState(props.comments)
  const [editing, setEditing] = useState('')
  const [formDetached, setFormDetached] = useState(false)

  if (!settings.enableCommenting || !enableCommenting) {
    return null
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()

    const commentObject = { content: formContent }

    if (!editing) {
      axios
        .post(`${apiPath}/${post._id}/comments`, commentObject)
        .then((res) => {
          setComments([...comments, res.data])
          setFormContent('')
        })
        .catch((err) => {
          console.error(err)
        })
    } else {
      axios
        .put(
          `${apiPath}/${post._id}/comments/${editing}`,
          commentObject
        )
        .then((res) => {
          const newComments = _.map(comments, (comment) => {
            if (comment._id === editing) {
              comment = res.data
            }
            return comment
          })
          setComments(newComments)
          setFormContent('')
          setEditing('')
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  const onDeleteClick = (comment: Comment) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this comment?'
    )

    if (confirm) {
      axios
        .delete(`${apiPath}/${post._id}/comments/${comment._id}`)
        .then((res) => {
          const newComments = _.filter(
            comments,
            (comm) => comm._id !== comment._id
          )
          setComments(newComments)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  const renderAuthOptions = (comment: Comment) => {
    if (
      currentUser &&
      (currentUser._id === comment.author._id || currentUser.isAdmin)
    ) {
      return (
        <div className="comment__buttons">
          <button
            className="button button-delete button-small"
            onClick={() => onDeleteClick(comment)}
          >
            Delete
          </button>
          <button
            className="button button-edit button-small"
            onClick={() => {
              setEditing(comment._id)
              setFormContent(comment.content)
            }}
          >
            Edit
          </button>
        </div>
      )
    }
  }

  const renderComments = () => {
    if (comments.length === 0) {
      return <p className="comments__none">Leave a comment.</p>
    }

    return _.map(comments, (comment) => {
      const { content, author, _id } = comment

      return (
        <div className="comment" key={_id}>
          <p className="comment__content">{renderHTML(content)}</p>
          <p className="comment__author">
            &mdash;{' '}
            {author.firstName ? author.firstName : author.email}
          </p>
          {renderAuthOptions(comment)}
        </div>
      )
    })
  }

  const renderEditingState = () => {
    if (editing) {
      return (
        <div className="comment__editing">
          <span className="comment__editing--state">Editing</span>
          <button
            className="button button-small button-tertiary"
            onClick={() => {
              setEditing('')
              setFormContent('')
            }}
          >
            Stop Editing
          </button>
        </div>
      )
    }
  }

  const renderCommentForm = () => {
    if (!currentUser) {
      return (
        <p className="comment-form__login">
          <Link href="/login">
            <a title="Login">Login</a>
          </Link>{' '}
          to comment.
        </p>
      )
    }

    return (
      <div className="comment__form">
        {renderEditingState()}
        <CommentForm
          detached={formDetached}
          onDetachClick={() => setFormDetached(!formDetached)}
          content={formContent}
          onChange={(newContent: string) => setFormContent(newContent)}
          onSubmit={handleSubmit}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="comments">
        <h3 className="heading-tertiary comments__title">Comments</h3>
        {renderComments()}
      </div>

      {beforeCommentForm()}
      {renderCommentForm()}
      {afterCommentForm()}
    </div>
  )
}

type CommentFormProps = {
  content: string
  onChange: Function
  onSubmit: Function
  detached: boolean
  onDetachClick: Function
}

const CommentForm: React.FC<CommentFormProps> = (props) => {
  const {
    content,
    onChange,
    onSubmit,
    detached,
    onDetachClick,
  } = props

  return (
    <form
      className={`comment-form ${detached ? 'detached' : ''}`}
      onSubmit={(event) => onSubmit(event)}
    >
      <label
        htmlFor="comment-text-editor"
        className="comment-form__label"
      >
        Comment
      </label>
      {/* <RichTextEditor
        id="comment-text-editor"
        className=comment-form__text-editor"
        content={content}
        onChange={newContent => onChange(newContent)}
      /> */}
      <textarea
        onChange={(newContent) => onChange(newContent.target.value)}
        id="comment-text-editor"
        className="comment-form__text-editor"
        value={content}
      ></textarea>

      <div className="comment-form__bottom">
        <input className="button button-primary" type="submit" />
        <div className="comment-form__detach">
          <input
            id="detach-checkbox"
            className="comment-form__checkbox--input"
            type="checkbox"
            onClick={() => onDetachClick()}
          />
          <label
            className="comment-form__detach--label"
            htmlFor="detach-checkbox"
          >
            {detached ? 'Attach' : 'Detach'} comment form
            <span className="comment-form__checkbox--span"></span>
          </label>
        </div>
      </div>
    </form>
  )
}

export const options: SectionOptions = {
  Standard: {
    file: 'SectionStandard',
    name: 'Standard Section',
    description:
      'This is the simplest section. It will only take one post with the required tags.',
    inputs: ['className', 'tags', 'maxPosts', 'title'],
    maxPosts: 1,
    defaultProps: {
      path: 'posts',
      apiPath: '/api/posts',
      redirectRoute: 'posts',
      renderAuthButtons: false,
    },
  },
}

export default SectionStandard
