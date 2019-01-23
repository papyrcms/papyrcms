const mongoose = require( 'mongoose' )

const settignsSchema = new mongoose.Schema({
  enableEmailing: { type: Boolean, default: false },
  enableMenu: { type: Boolean, default: false },
  enableCommenting: { type: Boolean, default: false },
  enableUserPosts: { type: Boolean, default: false },
  enableDonations: { type: Boolean, default: false },

  sectionCardSettings: {
    title: { type: String, default: "Card Section Settings" },
    maxPosts: { type: Number, default: 1 },
    postTags: { type: [String], default: [] }
  },
},
{
  usePushEach: true
})

module.exports = mongoose.model( 'settings', settignsSchema )
