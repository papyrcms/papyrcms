import React, { useState } from 'react'
import pagesContext from './pagesContext'

const PagesProvider = props => {

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
