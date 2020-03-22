/// <reference types="next" />
/// <reference types="next/types/global" />

declare module 'next-connect'
declare module 'react-render-html'
declare module 'react-tinymce'

type Req = {
  user: User,
  file: { path: string }
  login: Function,
  logout: Function
}
type Res = {
  locals: {
    settings: Settings
  }
}

type TinyMceEditor = HTMLTextAreaElement & { getContent: Function }

// type FileEventTarget = EventTarget & { files: FileList }

type Message = {
  _id: string,
  name: string,
  email: string,
  message: string,
  created: Date
}

type User = {
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

type comment = {
  _id: string,
  content: string,
  replies: Array<comment>,
  created: Date,
  author: User
}

type Blog = {
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
  comments: Array<comment>
}

type event = {
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
  longitude: number,
  comments: Array<never>
}

type Product = {
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
  quantity: number,
  comments: Array<never>
}

type Order = {
  _id: string,
  created: Date,
  products: Array<Product>,
  user: User,
  notes: string,
  shipped: boolean
}

type Page = {
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

type Post = {
  _id: string,
  title: string,
  slug: string,
  content: string,
  tags: Array<string>,
  mainMedia: string,
  subImages: Array<string>,
  published: boolean,
  created: Date,
  comments: Array<comment>
}

// type Setting = {
//   _id: string,
//   name: string,
//   options: object
// }

type Settings = {
  enableMenu: boolean,
  enableStore: boolean,
  enableBlog: boolean,
  enableEvents: boolean,
  enableCommenting: boolean,
  enableRegistration: boolean,
  enableEmailingToAdmin: boolean,
  enableEmailingToUsers: boolean
}

type Keys = {
  stripePubKey: string,
  googleMapsKey: string
}
