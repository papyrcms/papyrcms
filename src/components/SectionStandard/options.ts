import { SectionOptions } from '@/types'

export const options: SectionOptions = {
  Standard: {
    component: 'SectionStandard',
    name: 'Standard Section',
    description:
      'This is the simplest section. It will only take one post with the required tags.',
    inputs: ['className', 'tags', 'maxPosts', 'title'],
    maxPosts: 1,
    defaultProps: {
      path: 'posts',
      apiPath: '/api/posts',
      redirectRoute: 'posts',
      renderAuthButtons: false,
      setPageHead: false,
    },
  },
}
