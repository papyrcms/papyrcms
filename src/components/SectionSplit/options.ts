import { SectionOptions } from 'types'

export const options: SectionOptions = {
  Split: {
    component: 'SectionSplit',
    name: 'Split Section',
    description:
      'This section will display an image, a title, and some content, split down the middle with the image on one side and the text on the other, alternating which order by each row.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    defaultProps: {
      readMore: true,
      contentLength: 500,
    },
  },
  LeftSplit: {
    component: 'SectionSplit',
    name: 'Left Split Section',
    description:
      'This section will display an image, a title, and some content, split down the middle with the image on one side and the text on the other, with the image on the left side.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    defaultProps: {
      readMore: true,
      contentLength: 500,
      mediaLeft: true,
    },
  },
  RightSplit: {
    component: 'SectionSplit',
    name: 'Right Split Section',
    description:
      'This section will display an image, a title, and some content, split down the middle with the image on one side and the text on the other, with the image on the right side.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    defaultProps: {
      readMore: true,
      contentLength: 500,
      mediaRight: true,
    },
  },
}
