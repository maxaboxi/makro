const mongoose = require('mongoose');

const AnswerSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    comments: {
      type: Array,
      required: false
    },
    questionId: {
      type: String,
      required: true
    },
    votes: {
      type: Number,
      required: false,
      default: 0
    }
  },
  { timestamps: true }
);

const answer = (module.exports = mongoose.model('answer', AnswerSchema));

module.exports.getAllAnswers = (questionId, callback) => {
  const query = { questionId: questionId };
  answer
    .find()
    .sort({ createdAt: -1 })
    .exec(query, callback);
};

module.exports.saveAnswer = (a, callback) => {
  a.save(callback);
};
