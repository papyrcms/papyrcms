import React, { useState, useEffect } from 'react'
import TinyMCE from 'react-tinymce'


/**
 * RichTextEditor is a react-wrapped component using Tiny MCE
 *
 * @prop content - String - The text content inside the editor
 * @prop className - String - The class applied to the editor wrapper
 * @prop onChange - Function - The event handler when the content is changed
 */
const TextEditor = (props) => {

  const [useEditor, setUseEditor] = useState(false)
  useEffect(() => {
    setUseEditor(true)
    const editor = tinymce.EditorManager.get(props.name)
    if (editor && props.content === '') {
      editor.setContent(props.content)
    }
  }, [props.content])

  if (!useEditor) return null

  // NOT a fan of this
  const contentStyle = `
    body {
      font-family: 'Montserrat', 'Lato', sans-serif !important;
      font-size: 16px !important;
      font-weight: 400 !important;
      line-height: 1.3 !important;
    }
  `

  const { name, content, className, onChange } = props

  return (
    <div className={className}>
      <TinyMCE
        content={content}
        id={name}
        config={{
          plugins: 'autolink link image lists code',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright',
          height: 250,
          content_style: contentStyle
        }}
        onChange={(event) => {
          console.log(event.target)
          event.target.value = event.target.getContent()
          event.target.name = name
          onChange(event)
        }}
      />
    </div>
  )
}

export default TextEditor
