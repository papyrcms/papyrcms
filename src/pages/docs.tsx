import { useState, useEffect } from 'react'
import spec from '../../swagger-config.json'

const Docs = () => {
  const [domRendered, setDomRendered] = useState(false)
  useEffect(() => {
    setDomRendered(true)
  })

  if (!domRendered) {
    return null
  }

  // Can only import this once the DOM is loaded
  const SwaggerUI = require('swagger-ui-react').default

  return <SwaggerUI spec={spec} />
}

export default Docs
