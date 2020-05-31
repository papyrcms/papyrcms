import React from 'react'
import styles from './style.module.scss'
// import RichTextEditor from '@/components/RichTextEditor'


const CommentForm = (props) => {

  const { content, onChange, onSubmit, detached, onDetachClick } = props

  return (
    <form className={`${styles['comment-form']}  ${detached ? styles['detached'] : ''}`} onSubmit={event => onSubmit(event)}>

      <label htmlFor="comment-text-editor" className={styles["comment-form__label"]}>Comment</label>
      {/* <RichTextEditor
        id="comment-text-editor"
        className={styles["comment-form__text-editor"]}
        content={content}
        onChange={newContent => onChange(newContent)}
      /> */}
      <textarea
        onChange={newContent => onChange(newContent.target.value)}
        id="comment-text-editor"
        className={styles["comment-form__text-editor"]}
        value={content}
      >
      </textarea>

      <div className={styles["comment-form__bottom"]}>
        <input className="button button-primary" type="submit" />
        <div className={styles["comment-form__detach"]}>
          <input id="detach-checkbox" className={styles["comment-form__checkbox--input"]} type="checkbox" onClick={() => onDetachClick()} />
          <label className={styles["comment-form__detach--label"]} htmlFor="detach-checkbox">{detached ? 'Attach' : 'Detach'} comment form<span className="comment-form__checkbox--span"></span></label>
        </div>
      </div>

    </form>
  )
}

export default CommentForm
