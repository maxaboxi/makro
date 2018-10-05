const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    postId: {
      type: String,
      required: true
    },
    replyTo: {
      type: String,
      required: false
    },
    pointsTotal: {
      type: Number,
      required: false,
      default: 0
    }
  },
  { timestamps: true }
);

const Comment = (module.exports = mongoose.model('comment', CommentSchema));

module.exports.getAllCommentsWithId = (id, callback) => {
  const query = { postId: id };
  Comment.find(query)
    .sort({ pointsTotal: -1 })
    .exec(callback);
};

module.exports.addNewComment = (c, callback) => {
  c.save(callback);
};

module.exports.incrementPointTotal = (id, value) => {
  const query = { _id: id };
  Comment.findByIdAndUpdate(query, { $inc: { pointsTotal: value } }).exec();
};
