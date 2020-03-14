/// <reference types="next" />
/// <reference types="next/types/global" />

declare module 'react-render-html'

type FileEventTarget = EventTarget & { files: FileList }

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
  cart: Array<object>,
  created: Date,
  isAdmin: boolean,
  isSubscribed: boolean,
  isBanned: boolean
}
