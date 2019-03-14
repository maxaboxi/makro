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
    origPost: {
      type: String,
      required: true
    },
    pointsTotal: {
      type: Number,
      required: false,
      default: 0
    }
  },
  { timestamps: true }
);

const Answer = (module.exports = mongoose.model('answer', AnswerSchema));

module.exports.getAllAnswersWithId = (questionId, callback) => {
  const query = { questionId: questionId };
  Answer.find(query)
    .sort({ createdAt: -1 })
    .exec(callback);
};

module.exports.getAllAnswers = callback => {
  Answer.find(callback);
};

module.exports.saveAnswer = (a, callback) => {
  a.save(callback);
};

module.exports.editAnswer = (a, callback) => {
  const query = { _id: a._id };
  Answer.findByIdAndUpdate(query, a, callback);
};

module.exports.incrementPointTotal = (id, value) => {
  const query = { _id: id };
  Answer.findByIdAndUpdate(query, { $inc: { pointsTotal: value } }).exec();
};

module.exports.getAllAnswersWithUsername = (username, callback) => {
  const query = { username: username };
  Answer.find(query)
    .sort({ createdAt: -1 })
    .exec(callback);
};

module.exports.removeAnswers = (deletedAnswers, callback) => {
  const query = { _id: { $in: deletedAnswers } };
  Answer.remove(query, callback);
};
