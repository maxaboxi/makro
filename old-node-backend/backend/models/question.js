const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    info: {
      type: String,
      required: false
    },
    tags: {
      type: Array,
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

const Question = (module.exports = mongoose.model('question', QuestionSchema));

module.exports.getAllQuestions = callback => {
  Question.find()
    .sort({ createdAt: -1 })
    .exec(callback);
};

module.exports.getQuestionWithId = (id, callback) => {
  Question.findById({ _id: id }, callback);
};

module.exports.saveQuestion = (q, callback) => {
  q.save(callback);
};

module.exports.incrementPointTotal = (id, value) => {
  const query = { _id: id };
  Question.findByIdAndUpdate(query, { $inc: { pointsTotal: value } }).exec();
};

module.exports.getAllQuestionsWithUsername = (username, callback) => {
  const query = { username: username };
  Question.find(query)
    .sort({ createdAt: -1 })
    .exec(callback);
};

module.exports.removeQuestions = (deletedQuestions, callback) => {
  const query = { _id: { $in: deletedQuestions } };
  Question.remove(query, callback);
};
