import React from 'react'
import keysContext from './keysContext'

type Props = {
  keys: Keys,
  children: any
}

const KeysProvider = (props: Props) => {

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
