import * as database from '@/utilities/serverContext/database'

export interface Database {
  EntityType: typeof database.EntityType
  save: typeof database.save
  findOne: typeof database.findOne
  findAll: typeof database.findAll
  destroy: typeof database.destroy
  destroyAll: typeof database.destroyAll
  countAll: typeof database.countAll
}

export abstract class DbModel {
  id!: string
}

export class Token extends DbModel {
  value!: string
  userId!: string
  issued!: Date
  expiry!: Date
}

export class Page extends DbModel {
  title!: string
  className!: string
  route!: string
  navOrder!: number
  css!: string
  omitDefaultHeader!: boolean
  omitDefaultFooter!: boolean
  sections!: Section[]
  updatedAt?: Date
  createdAt?: Date
}

export type PostType = 'post' | 'blog' | 'event' | 'product'

export class Section extends DbModel {
  order!: number
  pageId!: string
  type!: string
  postType!: PostType
  tags!: string[]
  title!: string
  maxPosts!: number
  className!: string
  updatedAt?: Date
  createdAt?: Date
}

export class User extends DbModel {
  email!: string
  password!: string
  firstName!: string
  lastName!: string
  isAdmin!: boolean
  isSubscribed!: boolean
  isBanned!: boolean
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
  cart?: Product[]
  tokens?: string[]
  updatedAt?: Date
  createdAt?: Date
}

export class Post extends DbModel {
  title!: string
  tags!: string[]
  slug!: string
  media!: string
  content!: string
  isPublished!: boolean
  updatedAt?: Date
  createdAt?: Date
}

export class Blog extends Post {
  publishedAt?: Date
  comments!: Comment[]
}

export class Comment extends DbModel {
  content!: string
  replies!: Comment[]
  author!: User
  blogId!: string
  updatedAt?: Date
  createdAt?: Date
}

export class Event extends Post {
  date!: Date
  latitude?: number
  longitude?: number
  address?: string
}

export class Product extends Post {
  price!: number
  quantity!: number
}

export class Order extends DbModel {
  notes!: string
  products!: Product[]
  user?: User
  isShipped!: boolean
  updatedAt?: Date
  createdAt?: Date
}

export class Message extends DbModel {
  name!: string
  email!: string
  message!: string
  emailSent!: boolean
  updatedAt?: Date
  createdAt?: Date
}

export class Settings extends DbModel {
  name!: string
  options!: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
}

export class AppSettings {
  enableMenu!: boolean
  enableStore!: boolean
  storeMenuLocation!: number
  enableBlog!: boolean
  blogMenuLocation!: number
  enableEvents!: boolean
  eventsMenuLocation!: number
  enableCommenting!: boolean
  enableRegistration!: boolean
  enableEmailingToAdmin!: boolean
  enableEmailingToUsers!: boolean
}

export class SectionOptions {
  [key: string]: {
    component: string
    name: string
    description: string
    inputs: string[]
    maxPosts?: number
    defaultProps: any
  }
}

export class Keys {
  stripePublishableKey!: string
  stripeSecretKey?: string
  gmailClientId?: string
  gmailClientSecret?: string
  gmailRefreshToken?: string
  googleAnalyticsId!: string
  googleMapsKey!: string
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

export class Tags {
  static sectionHeader: 'section-header'
  static sectionFooter: 'section-footer'
  static copyright: 'copyright'
  static favicon: 'favicon'
  static siteDescription: 'site-description'
  static notification: 'notification'
  static persist: 'persist'
  static latitide: 'latitude'
  static longitude: 'longitude'
  static emailTemplate: 'email-template'
  static welcome: 'welcome'
  static forgotPassword: 'forgot-password'
  static bulkEmail: 'bulk-email'
  static externalLink: 'external-link'
  static orderNumber(number?: number) {
    if (!number) {
      return 'order-{number}'
    } else {
      return `order-${number}`
    }
  }
}
