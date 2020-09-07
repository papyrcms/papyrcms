import { SectionOptions, Post } from 'types'
import React from 'react'
import _ from 'lodash'
import sanitizeHTML from 'sanitize-html'
import PageHead from '@/components/PageHead'

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
    mainMedia = '',
    tags = [],
    content = '',
  } = props.post

  return (
    <>
      <PageHead
        title={title}
        image={mainMedia}
        description={sanitizeHTML(content, { allowedTags: [] })}
        keywords={_.join(tags, ', ')}
      />
    </>
  )
}

export const options: SectionOptions = {
  SectionSeo: {
    file: 'SectionSeo',
    name: 'Page SEO',
    description: '',
    inputs: ['tags'],
    maxPosts: 1,
    defaultProps: {},
  },
}

export default SectionSeo
