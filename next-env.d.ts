/// <reference types="next" />
/// <reference types="next/types/global" />

declare module 'react-render-html'

type FileEventTarget = EventTarget & { files: FileList }

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
  cart: Array<object>,
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
  published: Boolean,
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
  published: Boolean,
  created: Date,
  date: Date,
  latitude: Number,
  longitude: Number
}

interface Product {
  _id: string,
  title: string,
  slug: string,
  content: string,
  tags: Array<string>,
  mainMedia: string,
  subImages: Array<string>,
  published: Boolean,
  created: Date,
  price: Number,
  quantity: Number
}

interface Order {
  _id: string,
  created: Date,
  products: Array<Product>,
  user: User,
  notes: string,
  shipped: Boolean
}

interface Page {
  _id: string,
  title: string,
  className: string,
  route: string,
  navOrder: Number,
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
  published: Boolean,
  created: Date,
  comments: Array<Comment>
}

interface Setting {
  _id: string,
  name: string,
  options: Object
}