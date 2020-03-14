import React, { useState } from 'react'
import pagesContext from './pagesContext'

type Props = {
  pages: Array<object>,
  children: React.ReactChildren
}

const PagesProvider = (props: Props) => {

  const [pages, setPages] = useState(props.pages)

  return (
    <pagesContext.Provider
      value={{
        pages,
        setPages
      }}
    >
      {props.children}
    </pagesContext.Provider>
  )
}

export default PagesProvider
