if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod')
} else if (process.env.NODE_ENV === 'local') {
  module.exports = require('./devLocal')
} else {
  module.exports = require('./dev')
}