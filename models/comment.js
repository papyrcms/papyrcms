import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({

  content: { type: String, required: true },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment'
  }],
  created: { type: Date, default: Date.now },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
})

export default mongoose.model('comment', commentSchema)
