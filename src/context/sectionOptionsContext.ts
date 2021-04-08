import { SectionOptions } from '@/types'
import { createContext } from 'react'

type SectionOptionsContext = {
  sectionOptions: SectionOptions
  setSectionOptions: Function
}

export default createContext<SectionOptionsContext>({
  sectionOptions: {},
  setSectionOptions: (sectionOptions: SectionOptions) => {},
})
