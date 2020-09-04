export interface Page {
  _id: String
  className: String
  created: String
  css?: String
  navOrder: Number
  route: String
  sections: JSON[]
  title: String
}

export interface Post {
  _id: String
  title: String
  tags: String[]
  slug: String
  subImages: String[]
  mainMedia?: String
  content?: String
  created: String
  comments?: Comment[]
}

export interface Comment {
  _id: String
  content: String
  created: String,
  replies: String[],
  author: User
}

export interface User {
  _id: String
  email: String
  password: String
  firstName: String
  lastName: String
  isAdmin: Boolean
  isSubscribed: Boolean
  isBanned: Boolean
  address1?: String
  address2?: String
  city?: String
  state?: String
  country?: String
  zip?: String
  shippingAddress1?: String
  shippingAddress2?: String
  shippingCity?: String
  shippingState?: String
  shippingCountry?: String
  shippingZip?: String
  cart: Product[]
}

export interface Product extends Post {
  price: Number
  quantity: Number
}

export interface Order {
  created: String
  products: Product[]
  user?: User
  notes: String,
  shipped: Boolean
}

export interface Blog extends Post {
  publishDate?: String
}

export interface Event extends Post {
  date: String
  latitude: Number
  longitude: Number
}

export interface Message {
  name: String
  email: String
  message: String
  emailSent: Boolean
  created: String
}

export interface Settings {
  name: String
  options: JSON
}
