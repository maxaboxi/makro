const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: false
    },
    password: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: false,
      default: 0
    },
    height: {
      type: Number,
      required: false,
      default: 0
    },
    weight: {
      type: Number,
      required: false,
      default: 0
    },
    activity: {
      type: Number,
      required: false,
      default: 1
    },
    sex: {
      type: String,
      required: false,
      default: null
    },
    dailyExpenditure: {
      type: Number,
      required: false,
      default: 2000
    },
    userAddedExpenditure: {
      type: Number,
      required: false,
      default: 0
    },
    userAddedProteinTarget: {
      type: Number,
      required: false,
      default: 0
    },
    userAddedCarbTarget: {
      type: Number,
      required: false,
      default: 0
    },
    userAddedFatTarget: {
      type: Number,
      required: false,
      default: 0
    },
    lastLogin: {
      type: Date,
      required: false,
      default: null
    },
    role: {
      type: String,
      required: false,
      default: 'user'
    },
    meals: {
      type: Array,
      required: false,
      default: [
        { name: 'Aamupala', foods: [] },
        { name: 'Lounas', foods: [] },
        { name: 'Välipala 1', foods: [] },
        { name: 'Sali', foods: [] },
        { name: 'Välipala 2', foods: [] },
        { name: 'Iltapala', foods: [] }
      ]
    }
  },
  { timestamps: true }
);

const User = (module.exports = mongoose.model('User', UserSchema));

module.exports.getUserById = (userId, callback) => {
  User.findById(userId, callback);
};
