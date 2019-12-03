import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import axios from 'axios'
import renderHTML from 'react-render-html'
import CommentForm from './CommentForm'

class Comment extends Component {

  constructor(props) {

    super(props)

    this.state = {
      formContent: '',
      comments: props.comments,
      editing: null,
      formDetached: false
    }
  }


  handleSubmit(event) {

    event.preventDefault()

    const { post, apiPath } = this.props
    const { formContent, comments, editing } = this.state
    const commentObject = { content: formContent }

    if (!editing) {
      axios.post(`${apiPath}/${post._id}/comments`, commentObject)
        .then(res => {
          this.setState({ comments: [...comments, res.data], formContent: '' })
        }).catch(err => {
          console.error(err)
        })
    } else {
      axios.put(`${apiPath}/${post._id}/comments/${editing}`, commentObject)
        .then(res => {
          comments.forEach((sComment, i) => {
            if (sComment._id === editing) {
              let newCommentState = [...comments]
              newCommentState[i].content = formContent

              this.setState({ comments: newCommentState, formContent: '', editing: null })
            }
          })
        }).catch(err => {
          console.error(err)
        })
    }
  }


  onDeleteClick(comment) {

    const confirm = window.confirm('Are you sure you want to delete this comment?')

    if (confirm) {

      const { post, apiPath } = this.props
      const { comments } = this.state

      axios.delete(`${apiPath}/${post._id}/comments/${comment._id}`)
        .then(res => {
          comments.forEach((sComment, i) => {
            if (sComment._id === res.data) {
              let newCommentState = [...comments]
              newCommentState.splice(i, 1)

              this.setState({ comments: newCommentState })
            }
          })
        }).catch(err => {
          console.error(err)
        })
    }
  }


  renderAuthOptions(comment) {

    const { currentUser, post } = this.props

    if (!!currentUser && (
      currentUser._id === comment.author._id ||
      currentUser._id === post.author._id ||
      currentUser.isAdmin
    )) {
      return (
        <div className="comment__buttons">
          <button className="button button-secondary button-small" onClick={() => this.onDeleteClick(comment)}>Delete</button>
          <button className="button button-tertiary button-small" onClick={() => {
            this.setState({ editing: comment._id, formContent: comment.content })
          }}>Edit</button>
        </div>
      )
    }
  }


  renderComments() {

    const { comments } = this.state

    if (!!comments[0]) {
      return comments.map(comment => {
        const { content, author, _id } = comment

        return (
          <div className="comment" key={_id}>
            <p className="comment__content">{renderHTML(content)}</p>
            <p className="comment__author">&mdash; {author.firstName ? author.firstName : author.email}</p>
            {this.renderAuthOptions(comment)}
          </div>
        )
      })
    } else {
      return <p className="comments__none">Leave a comment.</p>
    }
  }


  renderEditingState() {

    if (!!this.state.editing) {
      return (
        <div className="comment__editing">
          <span className="comment__editing--state">Editing</span>
          <button
            className="button button-small button-tertiary"
            onClick={() => this.setState({ editing: null, formContent: '' })}
          >
            Stop Editing
          </button>
        </div>
      )
    }
  }


  renderCommentForm() {

    const { formDetached, formContent } = this.state

    if (!!this.props.currentUser) {
      return (
        <div className="comment__form">
          {this.renderEditingState()}
          <CommentForm
            detached={formDetached}
            onDetachClick={() => this.setState({ formDetached: !formDetached })}
            content={formContent}
            onChange={newContent => this.setState({ formContent: newContent })}
            onSubmit={event => this.handleSubmit(event)}
          />
        </div>
      )
    } else {
      return (
        <p className="comment-form__login">
          <Link href="/login"><a title="Login">Login</a></Link> to comment.
        </p>
      )
    }
  }


  render() {
    
    const { settings, enableCommenting } = this.props

    if (settings.enableCommenting && enableCommenting) {
      return (
        <div>
          <div className="comments">
            <h3 className="heading-tertiary comments__title">Comments</h3>
            {this.renderComments()}
          </div>
          {this.renderCommentForm()}
        </div>
      )
    } else {
      return null
    }
  }
}


const mapStateToProps = state => {

  const { currentUser, settings } = state

  return { currentUser, settings }
}


export default connect(mapStateToProps)(Comment)