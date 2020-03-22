/// <reference types="next" />
/// <reference types="next/types/global" />

declare module 'react-render-html'
declare module 'react-tinymce';

type TinyMceEditor = HTMLTextAreaElement & { getContent: Function }

// type FileEventTarget = EventTarget & { files: FileList }

interface Message {
  _id: string,
  name: string,
  email: string,
  message: string,
  created: Date
}

interface User {
  _id: string,
  email: string,
  firstName: string,
  lastName: string,
  address1: string,
  address2: string,
  city: string,
  state: string,
  zip: string,
  country: string,
  shippingFirstName: string,
  shippingLastName: string,
  shippingEmail: string,
  shippingAddress1: string,
  shippingAddress2: string,
  shippingCity: string,
  shippingState: string,
  shippingZip: string,
  shippingCountry: string,
  cart: Array<Product>,
  created: Date,
  isAdmin: boolean,
  isSubscribed: boolean,
  isBanned: boolean
}

interface Comment {
  _id: string,
  content: string,
  replies: Array<Comment>,
  created: Date,
  author: User
}

interface Blog {
  _id: string,
  title: string,
  slug: string,
  content: string,
  tags: Array<string>,
  mainMedia: string,
  subImages: Array<string>,
  published: boolean,
  created: Date,
  publishDate: Date,
  comments: Array<Comment>
}

interface Event {
  _id: string,
  title: string,
  slug: string,
  content: string,
  tags: Array<string>,
  mainMedia: string,
  subImages: Array<string>,
  published: boolean,
  created: Date,
  date: Date,
  latitude: number,
  longitude: number
}

interface Product {
  _id: string,
  title: string,
  slug: string,
  content: string,
  tags: Array<string>,
  mainMedia: string,
  subImages: Array<string>,
  published: boolean,
  created: Date,
  price: number,
  quantity: number
}

interface Order {
  _id: string,
  created: Date,
  products: Array<Product>,
  user: User,
  notes: string,
  shipped: boolean
}

interface Page {
  _id: string,
  url: string,
  title: string,
  className: string,
  route: string,
  navOrder: number,
  sections: Array<string>,
  css: string,
  created: Date,
}

interface Post {
  _id: string,
  title: string,
  slug: string,
  content: string,
  tags: Array<string>,
  mainMedia: string,
  subImages: Array<string>,
  published: boolean,
  created: Date,
  comments: Array<Comment>
}

// interface Setting {
//   _id: string,
//   name: string,
//   options: object
// }

interface Settings {
  enableMenu: boolean,
  enableStore: boolean,
  enableBlog: boolean,
  enableEvents: boolean,
  enableCommenting: boolean,
  enableRegistration: boolean
}

interface Keys {
  stripePubKey: string,
  googleMapsKey: string
}