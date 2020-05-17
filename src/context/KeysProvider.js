import React from 'react'
import keysContext from './keysContext'

const KeysProvider = (props) => {

  return (
    <keysContext.Provider
      value={{
        keys: props.keys
      }}
    >
      {props.children}
    </keysContext.Provider>
  )
}

export default KeysProvider
