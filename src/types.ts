export interface Page {
  id: string
  title: string
  className: string
  route: string
  navOrder: number
  css: string
  omitDefaultHeader: boolean
  omitDefaultFooter: boolean
  sections: Section[]
  updatedAt: Date
  createdAt: Date
}

export interface Section {
  id: string
  order: number
  type: string
  tags: string[]
  title: string
  className: string
  updatedAt: Date
  createdAt: Date
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isAdmin: boolean
  isSubscribed: boolean
  isBanned: boolean
  address1?: string
  address2?: string
  city?: string
  state?: string
  country?: string
  zip?: string
  shippingFirstName?: string
  shippingLastName?: string
  shippingEmail?: string
  shippingAddress1?: string
  shippingAddress2?: string
  shippingCity?: string
  shippingState?: string
  shippingCountry?: string
  shippingZip?: string
  cart: Product[]
  updatedAt: Date
  createdAt: Date
}

export interface Post {
  id: string
  title: string
  tags: string[]
  slug: string
  media: string
  content: string
  isPublished: boolean
  updatedAt: Date
  createdAt: Date
}

export interface Blog extends Post {
  publishedAt?: Date
  comments: Comment[]
}

export interface Comment {
  id: string
  content: string
  replies: Comment[]
  author: User
  updatedAt: Date
  createdAt: Date
}

export interface Event extends Post {
  date: Date
  latitude?: number
  longitude?: number
  address?: string
}

export interface Product extends Post {
  price: number
  quantity: number
}

export interface Order {
  id: string
  notes: string
  products: Product[]
  user?: User
  isShipped: boolean
  updatedAt: Date
  createdAt: Date
}

export interface Message {
  id: string
  name: string
  email: string
  message: string
  emailSent: boolean
  updatedAt: Date
  createdAt: Date
}

export interface Settings {
  id: string
  name: string
  options: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface AppSettings {
  enableMenu: boolean
  enableStore: boolean
  storeMenuLocation: number
  enableBlog: boolean
  blogMenuLocation: number
  enableEvents: boolean
  eventsMenuLocation: number
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
  tinyMceKey?: string
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
    id: string
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
  findOne: <M>(
    model: M,
    conditions: Conditions,
    options?: Options
  ) => M
  findAll: <M>(
    model: M,
    conditions?: Conditions,
    options?: Options
  ) => M[]
  update: <M>(
    model: M,
    conditions: Conditions,
    fields: Fields
  ) => void
  create: <M>(model: M, fields: Fields) => M
  destroy: <M>(model: M, conditions: Conditions) => void
  destroyAll: <M>(model: M, conditions?: Conditions) => void
  countAll: <M>(model: M) => number
}
