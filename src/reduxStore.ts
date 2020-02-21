import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reduxThunk from 'redux-thunk'


// Initial State
const initialReduxState = {
  stripePubKey: '',
  googleMapsKey: ''
}


// Reducer
export const reducer = (state = initialReduxState, action) => {
  switch (action.type) {
    case 'set_pub_key':
      return { ...state, stripePubKey: action.payload }
    case 'set_google_maps_key':
      return { ...state, googleMapsKey: action.payload }
    default:
      return state
  }
}


// Action creators
export const setStripePubKey = key => {
  return { type: 'set_pub_key', payload: key }
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
