import React from 'react'
import styles from './CommentForm.module.scss'

interface Props {
  content: string
  onChange: Function
  onSubmit: Function
  detached: boolean
  onDetachClick: Function
}

const CommentForm: React.FC<Props> = (props) => {
  const { content, onChange, onSubmit, detached, onDetachClick } =
    props

  return (
    <form
      className={`${detached ? styles.detached : ''}`}
      onSubmit={(event) => onSubmit(event)}
    >
      <label htmlFor="comment-text-editor" className={styles.label}>
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
        className={styles.editor}
        value={content}
      ></textarea>

      <div className={styles.bottom}>
        <input className="button-primary" type="submit" />
        <div>
          <input
            id="detach-checkbox"
            className={styles.input}
            type="checkbox"
            onClick={() => onDetachClick()}
          />
          <label className={styles.detach} htmlFor="detach-checkbox">
            {detached ? 'Attach' : 'Detach'}
            <span className={styles.span}></span>
          </label>
        </div>
      </div>
    </form>
  )
}

export default CommentForm
