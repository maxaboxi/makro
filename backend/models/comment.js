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
    }
  },
  { timestamps: true }
);

const Comment = (module.exports = mongoose.model('comment', CommentSchema));

module.exports.getAllCommentsWithId = (id, callback) => {
  const query = { postId: id };
  Comment.find(query)
    .sort({ votes: -1 })
    .exec(callback);
};

module.exports.addNewComment = (c, callback) => {
  c.save(callback);
};
