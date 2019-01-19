const mongoose = require( 'mongoose' )

const settignsSchema = new mongoose.Schema({
  enableEmailing: { type: Boolean, default: false },
  enableMenu: { type: Boolean, default: false },
  enableCommenting: { type: Boolean, default: false },
  enableUserPosts: { type: Boolean, default: false },

  aboutPageSettings: {
    title: { type: String, default: "About Page Settings" },
    maxPosts: { type: Number, default: 1 },
    postTags: { type: [String], default: [] }
  },
  servicesPageSettings: {
    title: { type: String, default: "Services Page Settings" },
    maxPosts: { type: Number, default: 1 },
    postTags: { type: [String], default: [] }
  }, 
  donatePageSettings: {
    title: { type: String, default: "Donate Page Settings" },
    maxPosts: { type: Number, default: 1 },
    postTags: { type: [String], default: [] }
  }, 
  sectionCardSettings: {
    title: { type: String, default: "Card Section Settings" },
    maxPosts: { type: Number, default: 1 },
    postTags: { type: [String], default: [] }
  },
  sectionVideoSettings: {
    title: { type: String, default: "Video Section Settings" },
    maxPosts: { type: Number, default: 1 },
    postTags: { type: [String], default: [] }
  }
},
{
  usePushEach: true
})

module.exports = mongoose.model( 'settings', settignsSchema )
