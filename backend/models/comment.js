const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(
  {
    username: {
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
    }
  },
  { timestamps: true }
);

const comment = (module.exports = mongoose.model('comment', CommentSchema));

module.exports.getAllCommentsWithId = (id, callback) => {
  const query = { postId: id };
  comment
    .find()
    .sort({ createdAt: -1 })
    .exec(query, callback);
};

module.exports.addNewComment = (c, callback) => {
  c.save(callback);
};
