import { Blog, Tags } from '@/types'
import { useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import { PageHead } from '@/components'
import { useUser, useBlogs, usePosts } from '@/context'
import { SectionCards } from '@/components'
import { usePostFilter, useSearchBar } from '@/hooks'
import styles from './blog.module.scss'

const BlogAllPage = () => {
  const { currentUser } = useUser()
  const { blogs, setBlogs } = useBlogs()

  useEffect(() => {
    if (currentUser?.isAdmin) {
      const getBlogs = async () => {
        const { data: blogs } = await axios.get('/api/blogs')
        setBlogs(blogs)
      }
      getBlogs()
    } else if (blogs.length === 0) {
      const fetchBlogs = async () => {
        const { data: foundBlogs } = await axios.get(
          '/api/blogs/published'
        )
        setBlogs(foundBlogs)
      }
      fetchBlogs()
    }
  }, [currentUser])

  const renderDate = (post: Blog) => {
    const date =
      post.isPublished && post.publishedAt
        ? post.publishedAt
        : post.createdAt

    return <p>{moment(date).format('MMMM Do, YYYY')}</p>
  }

  const { posts } = usePosts()

  let headTitle = 'Blog'
  const headerSettings = {
    maxPosts: 1,
    postTags: [Tags.sectionHeader],
  }
  const {
    posts: [headerPost],
  } = usePostFilter(posts, headerSettings)
  if (headerPost) {
    headTitle = `${headerPost.title} | ${headTitle}`
  }

  const { SearchBar, searchPosts } = useSearchBar(blogs)

  return (
    <>
      <PageHead title={headTitle} />
      <SectionCards
        afterTitle={() => (
          <SearchBar className={styles.searchBar} placeholder=" " />
        )}
        title="Blog"
        perRow={4}
        path="blog"
        contentLength={100}
        emptyMessage="There are no blogs yet."
        readMore
        posts={searchPosts}
        afterPostTitle={renderDate}
      />
    </>
  )
}

export default BlogAllPage
