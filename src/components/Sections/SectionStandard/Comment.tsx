import React, { useState, useContext } from 'react'
import Link from 'next/link'
import _ from 'lodash'
import axios from 'axios'
import renderHTML from 'react-render-html'
import userContext from '../../../context/userContext'
import settingsContext from '../../../context/settingsContext'
import CommentForm from './CommentForm'

type Props = {
  enableCommenting: boolean,
  post: any,
  apiPath: string,
  beforeCommentForm: Function,
  afterCommentForm: Function,
  comments: Array<any>
}

const Comment = (props: Props) => {

  const {
    enableCommenting, post, apiPath,
    beforeCommentForm, afterCommentForm
  } = props
  const { settings } = useContext(settingsContext)

  if (!settings.enableCommenting || !enableCommenting) {
    return null
  }

  const { currentUser } = useContext(userContext)

  const [formContent, setFormContent] = useState('')
  const [comments, setComments] = useState(props.comments)
  const [editing, setEditing] = useState(null)
  const [formDetached, setFormDetached] = useState(false)


  const handleSubmit = (event: MouseEvent) => {

    event.preventDefault()

    const commentObject = { content: formContent }

    if (!editing) {
      axios.post(`${apiPath}/${post._id}/comments`, commentObject)
        .then(res => {
          setComments([...comments, res.data])
          setFormContent('')
        }).catch(err => {
          console.error(err)
        })
    } else {
      axios.put(`${apiPath}/${post._id}/comments/${editing}`, commentObject)
        .then(res => {

          const newComments = _.map(comments, comment =>{
            if (comment._id === editing) {
              comment = res.data
            }
            return comment
          })
          setComments(newComments)
          setFormContent('')
          setEditing(null)

        }).catch(err => {
          console.error(err)
        })
    }
  }


  const onDeleteClick = (comment) => {

    const confirm = window.confirm('Are you sure you want to delete this comment?')

    if (confirm) {

      axios.delete(`${apiPath}/${post._id}/comments/${comment._id}`)
        .then(res => {

          const newComments = _.filter(comments, comm => comm._id !== comment._id)
          setComments(newComments)

        }).catch(err => {
          console.error(err)
        })
    }
  }


  const renderAuthOptions = (comment) => {

    if (
      currentUser && (
        currentUser._id === comment.author._id ||
        currentUser.isAdmin
      )
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

    return _.map(comments, comment => {

      const { content, author, _id } = comment

      return (
        <div className="comment" key={_id}>
          <p className="comment__content">{renderHTML(content)}</p>
          <p className="comment__author">&mdash; {author.firstName ? author.firstName : author.email}</p>
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
              setEditing(null)
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
          <Link href="/login"><a title="Login">Login</a></Link> to comment.
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
          onChange={newContent => setFormContent(newContent)}
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


export default Comment