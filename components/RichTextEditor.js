import React from 'react'
import CKEditor from 'react-ckeditor-component'


/**
 * RichTextEditor is a react-wrapped component using CK Editor
 *
 * @prop content - String - The text content inside the editor
 * @prop className - String - The class applied to the editor wrapper
 * @prop onChange - Function - The event handler when the content is changed
 *
 * TODO:
 *   - react-ckeditor-component is a third-party module. I would rather
 *     use a module made by the people at CKEditor. One is available;
 *     however, it does not play nicely with SSR. If it ever does, or if
 *     a better editor comes out, it may be beneficial to switch.
 */
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
