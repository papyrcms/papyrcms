import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import { postsContext, userContext } from '@/context'
import { PostIndex } from '@/components'
import styles from './posts.module.scss'
import { useSearchBar } from 'src/hooks'

const Posts = () => {
  const { currentUser } = useContext(userContext)
  const { posts, setPosts } = useContext(postsContext)
  useEffect(() => {
    const resetPosts = async () => {
      if (currentUser?.isAdmin) {
        const { data: foundPosts } = await axios.get('/api/posts')
        setPosts(foundPosts)
      }
    }
    resetPosts()
  }, [currentUser])

  const { SearchBar, searchPosts } = useSearchBar(posts)

  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <h2 className={`heading-secondary ${styles.header}`}>
          My Content
        </h2>
        <SearchBar className={styles.input} />
      </div>
      <PostIndex posts={searchPosts} />
    </div>
  )
}

export default Posts
