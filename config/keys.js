let keys

if (process.env.NODE_ENV === 'production') {
  keys = require('./prod')
} else {
  keys = require('./dev')
}

export default keys
