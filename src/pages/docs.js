import React, { useState, useEffect } from 'react'
import spec from '../../swagger-config.json'


const Docs = () => {

  const [domRendered, setDomRendered] = useState(false)
  useEffect(() => {
    setDomRendered(true)
  })

  if (!domRendered) {
    return null
  }

  const SwaggerUI = require('swagger-ui-react').default

  return <SwaggerUI
    spec={spec}
    // url="https://petstore.swagger.io/v2/swagger.json"
  />
}

export default Docs
