import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reduxThunk from 'redux-thunk'


// Initial State
const initialReduxState = {
  events: [],
  event: {},
  orders: [],
  users: [],
  messages: [],
  settings: {},
  stripePubKey: '',
  route: '',
  googleMapsKey: ''
}


// Reducer
export const reducer = (state = initialReduxState, action) => {
  switch (action.type) {
    case 'set_events':
      return { ...state, events: action.payload }
    case 'set_event':
      return { ...state, event: action.payload }
    case 'set_orders':
      return { ...state, orders: action.payload }
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
export const setEvents = events => {
  return { type: 'set_events', payload: events }
}

export const setEvent = event => {
  return { type: 'set_event', payload: event }
}

export const setOrders = orders => {
  return { type: 'set_orders', payload: orders }
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
export const initializeStore = (initialState = initialReduxState) => {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(reduxThunk)
    )
  )
}
