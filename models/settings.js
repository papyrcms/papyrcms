const mongoose = require('mongoose')

const settignsSchema = new mongoose.Schema({
  enableEmailing: { type: Boolean, default: false },
  enableMenu: { type: Boolean, default: false },
  enableCommenting: { type: Boolean, default: false },
  enableUserPosts: { type: Boolean, default: false },
  enableDonations: { type: Boolean, default: false },
  enableRegistration: { type: Boolean, default: true },
  enableStore: { type: Boolean, default: false }
},
{
  usePushEach: true
})

module.exports = mongoose.model('settings', settignsSchema)
