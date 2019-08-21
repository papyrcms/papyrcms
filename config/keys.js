if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod')
} else if (process.env.NODE_ENV === 'personal') {
  module.exports = require('./devPersonal')
} else {
  module.exports = require('./dev')
}