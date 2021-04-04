import React, { useState, useEffect } from 'react'
import TinyMCE from 'react-tinymce'
import styles from 'RichTextEditor.module.scss'

type Props = {
  name: string
  content: string
  className?: string
  onChange: Function
}

const TextEditor = (props: Props) => {
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
          convert_urls: false,
          plugins: 'autolink link image lists code',
          toolbar:
            'undo redo | bold italic | alignleft aligncenter alignright',
          height: 250,
          content_style: contentStyle,
        }}
        onChange={(event: any) => {
          event.target.value = event.target.getContent()
          event.target.name = name
          onChange(event)
        }}
      />
    </div>
  )
}

export default TextEditor
