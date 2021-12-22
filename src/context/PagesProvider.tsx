import { Page } from '@/types'
import { useState } from 'react'
import { pagesContext } from './pagesContext'

type Props = {
  pages: Page[]
  children: any
}

const PagesProvider = (props: Props) => {
  const [pages, setPages] = useState(props.pages)

  return (
    <pagesContext.Provider
      value={{
        pages,
        setPages,
      }}
    >
      {props.children}
    </pagesContext.Provider>
  )
}

export default PagesProvider
