import { SectionOptions } from 'types'

export const options: SectionOptions = {
  ThreeCards: {
    component: 'SectionCards',
    name: 'Three Cards Section',
    description:
      'This section will display each post in a vertical style with three posts per row.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    // maxPosts: null,
    defaultProps: {
      contentLength: 120,
      readMore: true,
      perRow: 3,
    },
  },
  FourCards: {
    component: 'SectionCards',
    name: 'Four Cards Section',
    description:
      'This section will display each post in a vertical style with four posts per row.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    // maxPosts: null,
    defaultProps: {
      contentLength: 120,
      readMore: true,
      perRow: 4,
    },
  },
}
