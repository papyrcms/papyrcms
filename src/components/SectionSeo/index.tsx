import { Post } from '@/types'
import React from 'react'
import _ from 'lodash'
import sanitizeHTML from 'sanitize-html'
import { PageHead } from '@/components'
import styles from './SectionSeo.module.scss'

type Props = {
  post: Post
}

/**
 * SectionSeo is the main SEO component per page
 * It will appear invisible but effect SEO for the page
 */
const SectionSeo: React.FC<Props> = (props) => {
  if (!props.post) {
    return null
  }

  const {
    title = '',
    media = '',
    tags = [],
    content = '',
  } = props.post

  return (
    <PageHead
      title={title}
      image={media}
      description={sanitizeHTML(content, { allowedTags: [] })}
      keywords={_.join(tags, ', ')}
    />
  )
}

export default SectionSeo
