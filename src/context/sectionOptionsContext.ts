import { SectionOptions } from '@/types'
import { createContext, useContext } from 'react'

type SectionOptionsContext = {
  sectionOptions: SectionOptions
  setSectionOptions: Function
}

export const sectionOptionsContext =
  createContext<SectionOptionsContext>({
    sectionOptions: {},
    setSectionOptions: (sectionOptions: SectionOptions) => {},
  })

const useSectionOptions = () => useContext(sectionOptionsContext)
export default useSectionOptions
