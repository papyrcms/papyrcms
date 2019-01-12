const mongoose = require( 'mongoose' );

const postSchema = new mongoose.Schema({

  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  mainImage: String,
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
});

module.exports = mongoose.model( 'post', postSchema );
