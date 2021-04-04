import { SectionOptions } from 'types'

export const options: SectionOptions = {
  Slideshow: {
    component: 'SectionSlideshow',
    name: 'Slideshow Section',
    description:
      'This section will display a slideshow of each post at 5 second intervals.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
    // maxPosts: null,
    defaultProps: {
      timer: 5000,
    },
  },
}
