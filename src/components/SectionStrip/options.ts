import { SectionOptions } from '@/types'

export const options: SectionOptions = {
  Strip: {
    component: 'SectionStrip',
    name: 'Strip Section',
    description:
      'This section will display each post in a horizontal style with the media alternating rendering on the left and right sides per post.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    // maxPosts: null,
    defaultProps: {
      readMore: true,
      contentLength: 300,
    },
  },
  LeftStrip: {
    component: 'SectionStrip',
    name: 'Left Strip Section',
    description:
      'This section will display each post in a horizontal style with the media rendering on the left side of the posts.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    // maxPosts: null,
    defaultProps: {
      readMore: true,
      contentLength: 300,
      mediaLeft: true,
    },
  },
  RightStrip: {
    component: 'SectionStrip',
    name: 'Right Strip Section',
    description:
      'This section will display each post in a horizontal style with the media rendering on the right side of the posts.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    // maxPosts: null,
    defaultProps: {
      readMore: true,
      contentLength: 300,
      mediaRight: true,
    },
  },
}
