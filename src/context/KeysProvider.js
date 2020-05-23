import React, { useState } from 'react'
import keysContext from './keysContext'

const KeysProvider = (props) => {

  const [keys, setKeys] = useState(props.keys)

  return (
    <keysContext.Provider
      value={{
        keys: keys
      }}
    >
      {props.children}
    </keysContext.Provider>
  )
}

export default KeysProvider
