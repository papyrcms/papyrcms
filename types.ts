export interface Page {
  _id: string
  className: string
  created: string
  css: string
  navOrder: number
  route: string
  sections: string[]
  title: string
}

export interface Post {
  _id: string
  title: string
  tags: string[]
  slug: string
  subImages: string[]
  mainMedia?: string
  content?: string
  created: string
  published: boolean
  comments?: Comment[]
}

export interface Comment {
  _id: string
  content: string
  created: string
  replies: string[]
  author: User
}

export interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  isAdmin: boolean
  isSubscribed: boolean
  isBanned: boolean
  created: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  country?: string
  zip?: string
  shippingFirstName?: String,
  shippingLastName?: String,
  shippingEmail?: String,
  shippingAddress1?: string
  shippingAddress2?: string
  shippingCity?: string
  shippingState?: string
  shippingCountry?: string
  shippingZip?: string
  cart: Product[]
}

export interface Product extends Post {
  price: number
  quantity: number
}

export interface Order {
  _id: string
  created: string
  products: Product[]
  user?: User
  notes: string
  shipped: boolean
}

export interface Blog extends Post {
  publishDate?: string
}

export interface Event extends Post {
  date: string
  latitude: number
  longitude: number
}

export interface Message {
  _id: string
  name: string
  email: string
  message: string
  emailSent: boolean
  created: string
}

export interface Settings {
  _id: string
  name: string
  options: JSON
}

export interface SectionOptions {
  [key: string]: {
    file: string
    name: string
    description: string
    inputs: string[]
    maxPosts?: number
    defaultProps: any
  }
}

export interface Keys {
  stripePublishableKey: string
  stripeSecretKey?: string
  gmailClientId?: string
  gmailClientSecret?: string
  gmailRefreshToken?: string
  googleAnalyticsId: string
  googleMapsKey: string
  siteEmail?: string
  adminEmail?: string
  cloudinaryApiKey?: string
  cloudinaryApiSecret?: string
  cloudinaryCloudName?: string
  databaseDriver?: string
  databaseURI?: string
  rootURL?: string
  jwtSecret?: string
  test?: {
    oldPass?: string
    newPass?: string
    token?: string
    tokenRpc?: string
  }
}
