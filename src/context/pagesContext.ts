import { createContext } from 'react'

type PagesContext = {
  pages: Array<Page>,
  setPages: Function
}

export default createContext<PagesContext>({
  pages: [],
  setPages: (pages: Array<Page>) => {}
})
