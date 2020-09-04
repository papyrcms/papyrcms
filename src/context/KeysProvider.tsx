import { Keys } from 'types'
import React, { useState } from 'react'
import keysContext from './keysContext'

type Props = {
  keys: Keys
  children: any
}

const KeysProvider = (props: Props) => {

  const [keys] = useState(props.keys)

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
