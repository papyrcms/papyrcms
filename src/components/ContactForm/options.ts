import { SectionOptions } from 'types'

export const options: SectionOptions = {
  ContactForm: {
    component: 'ContactForm',
    name: 'Contact Form',
    description:
      'This is a simple contact form where people can leave their name, email, and a message for you. It is not content-based.',
    inputs: ['className'],
    // maxPosts: null,
    defaultProps: {},
  },
}
