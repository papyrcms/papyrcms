import { Post } from '@/types'
import { useState, FC, useRef, useEffect } from 'react'
import { Input } from 'src/components'

const useSearchBar = <T extends Post>(posts: T[]) => {
  const [search, setSearch] = useState('')
  const [searchPosts, setSearchPosts] = useState(posts)
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    // I don't love this solution
    ref.current?.focus()
  }, [searchPosts])

  const onSearchTextChange = (event: any) => {
    setSearch(event.target.value)

    let foundPosts = posts.filter((post) => {
      for (const tag of post.tags) {
        if (tag.includes(event.target.value)) {
          return true
        }
      }
      return false
    })

    setSearchPosts(foundPosts)
  }

  interface Props {
    id?: string
    label?: string
    placeholder?: string
    name?: string
    className?: string
  }
  const SearchBar: FC<Props> = (props) => {
    return (
      <Input
        refProp={ref}
        key={props.id || 'posts-search'}
        id={props.id || 'posts-search'}
        label={props.label || 'Search'}
        placeholder={props.placeholder || 'search tags here'}
        name={props.name || 'search'}
        className={props.className || ''}
        value={search}
        onChange={onSearchTextChange}
      />
    )
  }

  return { SearchBar, searchPosts }
}

export default useSearchBar
