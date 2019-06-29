/**
 * RichTextEditor is a react-wrapped component using CK Editor
 * 
 * props include:
 *   content: String - The text content inside the editor
 *   className: String - The class applied to the editor wrapper
 *   onChange: Function - The event handler when the content is changed
 */


import React from 'react'
import CKEditor from 'react-ckeditor-component'

const TextEditor = props => {
  const { content, className, onChange } = props

  return (
    <CKEditor
      content={content}
      activeClass={className}
      events={{
        "change": event => onChange(event.editor.getData())
      }}
    />
  )
}

export default TextEditor
