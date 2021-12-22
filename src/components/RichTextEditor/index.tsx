import { useState, useEffect } from 'react'
import TinyMCE from 'react-tinymce'
import styles from 'RichTextEditor.module.scss'
import Input from '../Input'

type Props = {
  name: string
  content: string
  className?: string
  onChange: Function
}

const TextEditor = (props: Props) => {
  const [useRte, setUseRte] = useState(true)
  useEffect(() => {
    let storedUseRte = localStorage.getItem('useRte')
    if (!storedUseRte) {
      storedUseRte = 'true'
      localStorage.setItem('useRte', storedUseRte)
    }
    switch (storedUseRte) {
      case 'true':
        setUseRte(true)
        break
      case 'false':
        setUseRte(false)
        break
      default:
        storedUseRte = 'true'
        localStorage.setItem('useRte', storedUseRte)
    }
  }, [])

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
      <Input
        type="checkbox"
        label="Rich Text Editor"
        value={useRte}
        onChange={(event: any) => {
          setUseRte(event.target.checked)
          localStorage.setItem(
            'useRte',
            event.target.checked.toString()
          )
        }}
      />
      {useRte ? (
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
      ) : (
        <Input
          type="textarea"
          value={content}
          id={name}
          name={name}
          onChange={onChange}
        />
      )}
    </div>
  )
}

export default TextEditor
