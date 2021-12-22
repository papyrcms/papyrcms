import { SectionOptions } from '@/types'
import { useState } from 'react'
import { sectionOptionsContext } from './sectionOptionsContext'

type Props = {
  sectionOptions: SectionOptions
  children: any
}

const SectionOptionsProvider = (props: Props) => {
  const [sectionOptions, setSectionOptions] = useState(
    props.sectionOptions
  )

  return (
    <sectionOptionsContext.Provider
      value={{
        sectionOptions,
        setSectionOptions,
      }}
    >
      {props.children}
    </sectionOptionsContext.Provider>
  )
}

export default SectionOptionsProvider
