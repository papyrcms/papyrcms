import { Page } from '@/types'
import { createContext, useContext } from 'react'

type PageContext = {
  pages: Page[]
  setPages: Function
}

export const pagesContext = createContext<PageContext>({
  pages: [],
  setPages: (pages: Page[]) => {},
})

const usePages = () => useContext(pagesContext)
export default usePages
