import { Blog, Post } from '@/types'
import React, { useContext } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { userContext, postsContext } from '@/context'
import { Media, PageHead } from '@/components'
import { usePostFilter } from '@/hooks'
import Comments from './Comments'
import styles from './SectionStandard.module.scss'

type Props = {
  posts?: Post[]
  enableCommenting?: boolean
  apiPath?: string
  className?: string
  redirectRoute?: string
  path?: string
  emptyTitle?: string
  emptyMessage?: string
  renderAuthButtons?: boolean
  setPageHead?: boolean

  // Hook functions
  beforePost?: Function
  afterPost?: Function
  beforeTitle?: Function
  afterTitle?: Function
  beforeMedia?: Function
  afterMedia?: Function
  beforeContent?: Function
  afterContent?: Function
  beforeComments?: Function
  afterComments?: Function
  beforeCommentForm?: Function
  afterCommentForm?: Function
}

/**
 * SectionStandard is the main component to show the details of an array of posts
 *
 * @prop posts - Array[Object] - The post that will be displayed on the page
 * @prop enableCommenting - Boolean - Whether or not users can comment on this post
 * @prop path - String - The prefix for accessing the edit page
 * @prop renderAuthButtons - Boolean - Whether or not to render auth buttons. Default true
 * @prop apiPath - String - The api prefix for CRUD operations
 * @prop redirectRoute - String - The route to redirect to after deleting the post
 * @prop className - String - Any additional classes to wrap the component
 * @prop emptyTitle - String - A title to display when there is no post passed
 * @prop emptyMessage - String - A message to display when there is no post passed
 *
 * Post Hooks
 * @prop beforePost - Function - Rendered before each post
 * @prop afterPost - Function - Rendered after each post
 * @prop beforeTitle - Function - Rendered before each post title
 * @prop afterTitle - Function - Rendered after each post title
 * @prop beforeMedia - Function - Rendered before each post main media
 * @prop afterMedia - Function - Rendered after each post main media
 * @prop beforeContent - Function - Rendered before each post content
 * @prop afterContent - Function - Rendered after each post content
 * @prop beforeComments - Function - Rendered before each post comments
 * @prop afterComments - Function - Rendered after each post comments
 * @prop beforeCommentForm - Function - Rendered before each post comment form
 * @prop afterCommentForm - Function - Rendered after each post comment form
 */
const SectionStandard: React.FC<Props> = (props) => {
  const { currentUser } = useContext(userContext)
  const { posts, setPosts } = useContext(postsContext)
  const router = useRouter()
  const { push, route } = router

  if (!props.posts?.find((p) => !!p)) return null

  const {
    enableCommenting,
    apiPath,
    className,
    redirectRoute,
    path,
    emptyTitle,
    emptyMessage,
    renderAuthButtons = true,
    setPageHead = true,

    // Hook functions
    beforePost = () => null,
    afterPost = () => null,
    beforeTitle = () => null,
    afterTitle = () => null,
    beforeMedia = () => null,
    afterMedia = () => null,
    beforeContent = () => null,
    afterContent = () => null,
    beforeComments = () => null,
    afterComments = () => null,
    beforeCommentForm = () => null,
    afterCommentForm = () => null,
  } = props

  if (posts.length === 0 || Object.keys(posts).length == 0) {
    return (
      <section className={`${styles.section} ${className || ''}`}>
        <h2 className="heading-secondary">{emptyTitle}</h2>
        <h3 className="heading-tertiary">{emptyMessage}</h3>
      </section>
    )
  }

  const onDeleteClick = (post: Post) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this post?'
    )

    if (confirm) {
      const deletePath = apiPath ? apiPath : '/api/posts'
      const deleteRedirect = redirectRoute ? redirectRoute : '/posts'

      axios
        .delete(`${deletePath}/${post.id}`)
        .then((res) => {
          const newPosts = posts.filter(
            (filtered) => filtered.id !== post.id
          )
          setPosts(newPosts)
          push(deleteRedirect)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const renderAuthOptions = (post: Post) => {
    if (currentUser?.isAdmin && renderAuthButtons) {
      return (
        <div className={styles.buttons}>
          <button
            className="button-delete"
            onClick={() => onDeleteClick(post)}
          >
            Delete
          </button>
          <Link
            href={`/${path}/[id]/edit`}
            as={`/${path}/${post.id}/edit`}
          >
            <button className="button-edit">Edit</button>
          </Link>
        </div>
      )
    }
  }

  const renderTags = (post: Post) => {
    return post.tags.map((tag, i) => {
      if (i < post.tags.length - 1) {
        return <span key={tag}>{tag}, </span>
      } else {
        return <span key={tag}>{tag}</span>
      }
    })
  }

  const renderTagsSection = (post: Post) => {
    if (
      post.tags &&
      post.tags[0] &&
      currentUser?.isAdmin &&
      !['/', '/[page]'].includes(route)
    ) {
      return (
        <p className={styles.tags}>
          Tags: <em>{renderTags(post)}</em>
        </p>
      )
    }
  }

  const renderMedia = (post: Post) => {
    if (post.media) {
      return (
        <div className={styles.image}>
          <Media src={post.media} alt={post.title} />
        </div>
      )
    }
  }

  const renderPublishSection = (post: Post) => {
    if (!post.isPublished) {
      return (
        <p>
          <em>Not published</em>
        </p>
      )
    }
  }

  const renderComments = (post: Post) => {
    return (
      <Comments
        post={post}
        comments={(post as Blog).comments || []}
        enableCommenting={!!enableCommenting}
        apiPath={apiPath}
        beforeCommentForm={beforeCommentForm}
        afterCommentForm={afterCommentForm}
      />
    )
  }

  const renderPosts = () => {
    return props.posts?.map((post) => {
      if (!post) return null
      return (
        <div key={post.id}>
          {beforePost(post)}

          <div className={styles.post}>
            {renderPublishSection(post)}

            {beforeTitle(post)}
            <h2 className="heading-secondary">{post.title}</h2>
            {afterTitle(post)}

            {renderTagsSection(post)}

            {beforeMedia(post)}
            {renderMedia(post)}
            {afterMedia(post)}

            {beforeContent(post)}
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
            />
            {afterContent(post)}

            {renderAuthOptions(post)}

            {beforeComments(post)}
            {renderComments(post)}
            {afterComments(post)}
          </div>

          {afterPost(post)}
        </div>
      )
    })
  }

  const renderPageHead = (passedPosts: Post[]) => {
    if (!setPageHead || !passedPosts.length) return null

    const [{ title, tags, media, content }] = passedPosts
    let postContent = content || ''

    let headTitle
    const headerSettings = {
      maxPosts: 1,
      postTags: ['section-header'],
    }
    const {
      posts: [headerPost],
    } = usePostFilter(posts, headerSettings)
    if (headerPost && title) {
      headTitle = `${headerPost.title} | ${title}`
    }

    return (
      <PageHead
        title={headTitle}
        image={media}
        description={postContent
          .replace('<p>', '')
          .replace('</p>', '')}
        keywords={tags.toString()}
      />
    )
  }

  return (
    <section className={`${styles.section} ${className || ''}`}>
      {renderPageHead(props.posts)}

      {renderPosts()}
    </section>
  )
}

export default SectionStandard
