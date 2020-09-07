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
  password: string
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
  shippingFirstName?: String
  shippingLastName?: String
  shippingEmail?: String
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
  comments: Comment[]
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
  enableMenu: boolean
  enableStore: boolean
  enableBlog: boolean
  enableEvents: boolean
  enableCommenting: boolean
  enableRegistration: boolean
  enableEmailingToAdmin: boolean
  enableEmailingToUsers: boolean
}

export interface SectionOptions {
  [key: string]: {
    component: string
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

export interface Models {
  Blog: Blog
  Event: Event
  Message: Message
  Comment: Comment
  Order: Order
  Page: Page
  Post: Post
  Product: Product
  Settings: {
    _id: string
    name: string
    options: any
  }
  User: User
}

type Fields = {
  [key: string]: any
}

type Conditions = {
  [key: string]: any
}

type Options = {
  sort?: { [key: string]: number }
  include?: string[]
}

export interface Database extends Models {
  findOne: <M>(model: M, conditions: Conditions, options?: Options) => M
  findAll: <M>(model: M, conditions?: Conditions, options?: Options) => M[]
  update: <M>(model: M, conditions: Conditions, fields: Fields) => void
  create: <M>(model: M, fields: Fields) => M
  destroy: <M>(model: M, conditions: Conditions) => void
  destroyAll: <M>(model: M, conditions?: Conditions) => void
  countAll: <M>(model: M) => number
}
