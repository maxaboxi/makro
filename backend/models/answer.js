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

module.exports.getTopAnswer = (questionId, callback) => {
  const query = { questionId: questionId };
  answer
    .find(query)
    .sort({ votes: -1 })
    .limit(1)
    .exec(callback);
};

module.exports.editAnswer = (a, callback) => {
  const query = { _id: a._id };
  answer.findByIdAndUpdate(query, a, callback);
};
