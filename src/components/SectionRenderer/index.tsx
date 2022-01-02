import * as Components from '@/components'
import { Post } from '@/types'

interface Props {
  path: string
  posts: Post[]
  title: string
  className: string
  emptyMessage: string
  component: string
  defaultProps: Record<string, any>
}

const SectionRenderer: React.FC<Props> = (props) => {
  // @ts-ignore Not sure how to fix this
  const Component = Components[props.component]

  // Return the section component
  return (
    <Component
      title={props.title}
      className={props.className || ''}
      post={props.posts[0]}
      posts={props.posts}
      emptyTitle={props.title || ''}
      emptyMessage={props.emptyMessage || ''}
      alt={props.title || ''}
      path={props.path}
      {...props.defaultProps}
    />
  )
}

export default SectionRenderer
