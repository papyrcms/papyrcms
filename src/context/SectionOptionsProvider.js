import React, { useState } from 'react'
import sectionOptionsContext from './sectionOptionsContext'

const SectionOptionsProvider = (props) => {

  const [sectionOptions, setSectionOptions] = useState(props.sectionOptions)

  return (
    <sectionOptionsContext.Provider
      value={{
        sectionOptions,
        setSectionOptions
      }}
    >
      {props.children}
    </sectionOptionsContext.Provider>
  )
}

export default SectionOptionsProvider
