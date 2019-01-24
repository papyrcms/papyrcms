const mongoose = require( 'mongoose' )

const postSchema = new mongoose.Schema({

  title: String,
  content: String,
  tags: [String],
  mainMedia: String,
  subImages: [String],
  published: { type: Boolean, default: false },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment'
  }],
  created: { type: Date, default: Date.now },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
},
{
  usePushEach: true
})

module.exports = mongoose.model( 'post', postSchema )
