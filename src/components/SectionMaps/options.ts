import { SectionOptions } from 'types'

export const options: SectionOptions = {
  Map: {
    component: 'SectionMaps',
    name: 'Map Section',
    description:
      'This section will display a google map at the location specified by the latitude and longitude posts, along with the content of the main post.',
    inputs: ['className', 'tags', 'title'],
    maxPosts: 3,
    defaultProps: {
      mapLocation: 'end',
    },
  },
}
