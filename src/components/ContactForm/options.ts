import { SectionOptions } from '@/types'

export const options: SectionOptions = {
  ContactForm: {
    component: 'ContactForm',
    name: 'Contact Form',
    description:
      'This is a simple contact form where people can leave their name, email, and a message for you. If you include a post, the message will initially be populated by the post content.',
    inputs: ['className', 'tags', 'maxPosts'],
    // maxPosts: null,
    defaultProps: {},
  },
}
