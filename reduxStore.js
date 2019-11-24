import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reduxThunk from 'redux-thunk'


// Initial State
const initialState = {
  currentUser: null,
  page: {},
  posts: [],
  post: {},
  blogs: [],
  blog: {},
  events: [],
  event: {},
  products: [],
  product: {},
  users: [],
  messages: [],
  settings: {},
  stripePubKey: '',
  route: '',
  googleMapsKey: ''
}


// Reducer
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'set_current_user':
      return { ...state, currentUser: action.payload }
    case 'set_page':
      return { ...state, page: action.payload }
    case 'set_posts':
      return { ...state, posts: action.payload }
    case 'set_post':
      return { ...state, post: action.payload }
    case 'set_blogs':
      return { ...state, blogs: action.payload }
    case 'set_blog':
      return { ...state, blog: action.payload }
    case 'set_events':
      return { ...state, events: action.payload }
    case 'set_event':
      return { ...state, event: action.payload }
    case 'set_products':
      return { ...state, products: action.payload }
    case 'set_product':
      return { ...state, product: action.payload }
    case 'set_users':
      return { ...state, users: action.payload }
    case 'set_messages':
      return { ...state, messages: action.payload }
    case 'set_settings':
      return { ...state, settings: action.payload }
    case 'set_pub_key':
      return { ...state, stripePubKey: action.payload }
    case 'set_route':
      return { ...state, route: action.payload }
    case 'set_url':
      return { ...state, url: action.payload }
    case 'set_google_maps_key':
      return { ...state, googleMapsKey: action.payload }
    default:
      return state
  }
}


// Action creators
export const setCurrentUser = currentUser => {
  return { type: 'set_current_user', payload: currentUser }
}

export const setPage = page => {
  return { type: 'set_page', payload: page }
}

export const setPosts = posts => {
  return { type: 'set_posts', payload: posts }
}

export const setPost = post => {
  return { type: 'set_post', payload: post }
}

export const setBlogs = blogs => {
  return { type: 'set_blogs', payload: blogs }
}

export const setBlog = blog => {
  return { type: 'set_blog', payload: blog }
}

export const setEvents = events => {
  return { type: 'set_events', payload: events }
}

export const setEvent = event => {
  return { type: 'set_event', payload: event }
}

export const setProducts = products => {
  return { type: 'set_products', payload: products }
}

export const setProduct = product => {
  return { type: 'set_product', payload: product }
}

export const setUsers = users => {
  return { type: 'set_users', payload: users }
}

export const setMessages = messages => {
  return { type: 'set_messages', payload: messages }
}

export const setSettings = settings => {
  return { type: 'set_settings', payload: settings }
}

export const setStripePubKey = key => {
  return { type: 'set_pub_key', payload: key }
}

export const setRoute = route => {
  return { type: 'set_route', payload: route }
}

export const setUrl = url => {
  return { type: 'set_url', payload: url }
}

export const setGoogleMapsKey = key => {
  return { type: 'set_google_maps_key', payload: key }
}

// Initialization
export const initializeStore = (initialState = initialState) => {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(reduxThunk)
    )
  )
}
