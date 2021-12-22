import { Post } from '@/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useUser } from '@/context'
import keys from '@/keys'
import { SectionStandard } from '@/components'

const PostsShow = (props: { post: Post }) => {
  const { currentUser } = useUser()
  const { query } = useRouter()
  const [post, setPost] = useState(props.post)

  useEffect(() => {
    const resetPost = async () => {
      if (currentUser?.isAdmin) {
        const { data: foundPost } = await axios.get(
          `/api/posts/${query.id}`
        )
        setPost(foundPost)
      }
    }
    resetPost()
  }, [currentUser])

  return (
    <SectionStandard
      posts={[post]}
      enableCommenting={false}
      path="posts"
    />
  )
}

PostsShow.getInitialProps = async ({
  query,
}: {
  query: { id: string }
}) => {
  try {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const { data: post } = await axios.get(
      `${rootUrl}/api/posts/${query.id}`
    )

    return { post }
  } catch (err: any) {
    return {}
  }
}

export default PostsShow
