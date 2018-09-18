const mongoose = require('mongoose');

const FeedbackSchema = mongoose.Schema(
  {
    feedback: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: false,
      default: ''
    },
    username: {
      type: String,
      required: false,
      default: 'Nimetön'
    },
    answerDate: {
      type: Date,
      required: false,
      default: ''
    },
    answerUsername: {
      type: String,
      required: false,
      default: 'Arto'
    }
  },
  { timestamps: true }
);

const Feedback = (module.exports = mongoose.model('Feedback', FeedbackSchema));

module.exports.saveFeedback = (feedback, callback) => {
  feedback.save(callback);
};

module.exports.getFeedbacks = callback => {
  Feedback.find()
    .sort({ createdAt: -1 })
    .exec(callback);
};
