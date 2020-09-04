import { Page } from 'types'
import { createContext } from 'react'

type PageContext = {
  pages: Page[]
  setPages: Function
}

export default createContext<PageContext>({
  pages: [],
  setPages: (pages: Page[]) => {}
})
