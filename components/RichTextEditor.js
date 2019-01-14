import React from 'react'
import CKEditor from 'react-ckeditor-component'

const TextEditor = props => {
  const { content, className, onChange } = props;

  return (
    <CKEditor
      content={ content }
      activeClass={ className }
      events={{
        "change": event => onChange( event.editor.getData() )
      }}
    />
  )
}

export default TextEditor
