import React, { useState, useContext } from 'react'
import { Post, Comment } from '@/types'
import axios from 'axios'
import Link from 'next/link'
import { settingsContext, useUser } from '@/context'
import CommentForm from '../CommentForm'
import styles from './Comments.module.scss'

type Props = {
  comments: Comment[]
  enableCommenting?: boolean
  post: Post
  apiPath?: string
  beforeCommentForm?: Function
  afterCommentForm?: Function
}

const Comments: React.FC<Props> = (props) => {
  const {
    enableCommenting,
    post,
    apiPath,
    beforeCommentForm = () => null,
    afterCommentForm = () => null,
  } = props

  const { settings } = useContext(settingsContext)
  const { currentUser } = useUser()

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
        .post(`${apiPath}/${post.id}/comments`, commentObject)
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
          `${apiPath}/${post.id}/comments/${editing}`,
          commentObject
        )
        .then((res) => {
          const newComments = comments.map((comment) => {
            if (comment.id === editing) {
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
        .delete(`${apiPath}/${post.id}/comments/${comment.id}`)
        .then((res) => {
          const newComments = comments.filter(
            (comm) => comm.id !== comment.id
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
      (currentUser.id === comment.author.id || currentUser.isAdmin)
    ) {
      return (
        <div className={styles.buttons}>
          <button
            className="button-delete button-small"
            onClick={() => onDeleteClick(comment)}
          >
            Delete
          </button>
          <button
            className="button-edit button-small"
            onClick={() => {
              setEditing(comment.id)
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
      return <p className={styles.none}>Leave a comment.</p>
    }

    return comments.map((comment) => {
      const { content, author, id } = comment

      return (
        <div className={styles.comment} key={id}>
          <p className={styles.content}>{content}</p>
          <p className={styles.author}>
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
        <div className={styles.editing}>
          <span className={styles.state}>Editing</span>
          <button
            className="button-small button-tertiary"
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
        <p className={styles.login}>
          <Link href="/login">
            <a title="Login">Login</a>
          </Link>{' '}
          to comment.
        </p>
      )
    }

    return (
      <div className={styles.form}>
        {renderEditingState()}
        <CommentForm
          detached={formDetached}
          onDetachClick={() => setFormDetached(!formDetached)}
          content={formContent}
          onChange={(newContent: string) =>
            setFormContent(newContent)
          }
          onSubmit={handleSubmit}
        />
      </div>
    )
  }

  return (
    <div>
      <div>
        <h3 className={`heading-tertiary ${styles.title}`}>
          Comments
        </h3>
        {renderComments()}
      </div>

      {beforeCommentForm()}
      {renderCommentForm()}
      {afterCommentForm()}
    </div>
  )
}

export default Comments
