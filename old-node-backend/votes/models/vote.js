const mongoose = require('mongoose');

const VoteSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    vote: {
      type: Number,
      required: true
    },
    postId: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Vote = (module.exports = mongoose.model('vote', VoteSchema));

module.exports.getAllVotesWithPostId = (id, callback) => {
  const query = { postId: id };
  Vote.find(query, callback);
};

module.exports.getAllVotesWithUserId = (id, callback) => {
  const query = { userId: id };
  Vote.find(query)
    .sort({ createdAt: -1 })
    .exec(callback);
};

module.exports.getAllVotesWithPostId = (id, callback) => {
  const query = { postId: id };
  Vote.find(query)
    .sort({ createdAt: -1 })
    .exec(callback);
};

module.exports.getUserVoteWithPostId = (userId, postId, callback) => {
  const query = { userId: userId, postId: postId };
  Vote.find(query, callback);
};

module.exports.addNewVote = (v, callback) => {
  v.save(callback);
};

module.exports.replaceVote = (v, callback) => {
  const query = { postId: v.postId, userId: v.userId };
  Vote.findOneAndUpdate(query, v, { new: true }, callback);
};

module.exports.removeVotes = (deletedVotes, callback) => {
  const query = { _id: { $in: deletedVotes } };
  Vote.remove(query, callback);
};

module.exports.getAllVotes = callback => {
  Vote.find(callback);
};