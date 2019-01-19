import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reduxThunk from 'redux-thunk'


const initialState = {
  currentUser: null,
  posts: [],
  post: {},
  users: [],
  settings: {},
  stripePubKey: ''
}


export const reducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case 'set_current_user':
      return { ...state, currentUser: action.payload }
    case 'set_posts':
      return { ...state, posts: action.payload }
    case 'set_post':
      return { ...state, post: action.payload }
    case 'set_users':
      return { ...state, users: action.payload }
    case 'set_settings':
      return { ...state, settings: action.payload }
    case 'set_pub_key':
      return { ...state, stripePubKey: action.payload }
    default:
      return state
  }
}


export const setCurrentUser = currentUser => {
  return { type: 'set_current_user', payload: currentUser }
}

export const setPosts = posts => {
  return { type: 'set_posts', payload: posts }
}

export const setPost = post => {
  return { type: 'set_post', payload: post }
}

export const setUsers = users => {
  return { type: 'set_users', payload: users }
}

export const setSettings = settings => {
  return { type: 'set_settings', payload: settings }
}

export const setStripePubKey = key => {
  return { type: 'set_pub_key', payload: key }
}

export function initializeStore ( initialState = initialState ) {
  return createStore( reducer, initialState, composeWithDevTools( applyMiddleware( reduxThunk ) ) )
}
