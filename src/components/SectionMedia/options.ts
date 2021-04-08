import { SectionOptions } from '@/types'

export const options: SectionOptions = {
  Parallax: {
    component: 'SectionMedia',
    name: 'Parallax Section',
    description:
      'This section will display a post with the parallax effect on the media.',
    inputs: ['className', 'tags', 'title'],
    maxPosts: 1,
    defaultProps: {
      fixed: true,
    },
  },
  Media: {
    component: 'SectionMedia',
    name: 'Media Section',
    description: 'This section will display a post media normally.',
    inputs: ['className', 'tags', 'title'],
    maxPosts: 1,
    defaultProps: {},
  },
}
