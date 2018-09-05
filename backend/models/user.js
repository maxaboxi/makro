const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
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
    default: 0
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
  meals: {
    type: Array,
    required: false,
    default: [
      { name: 'Aamiainen', foods: [] },
      { name: 'Lounas', foods: [] },
      { name: 'Välipala 1', foods: [] },
      { name: 'Sali', foods: [] },
      { name: 'Välipala 2', foods: [] },
      { name: 'Illallinen', foods: [] }
    ]
  }
});

const User = (module.exports = mongoose.model('User', UserSchema));

module.exports.getUserById = function(userId, callback) {
  User.findById(userId, callback);
};

module.exports.getUserByUserName = function(username, callback) {
  const query = { username: username };
  User.findOne(query, callback);
};

module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(12, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports.updateUserInformation = function(userObject, userId, callback) {
  const query = { _id: userId };
  User.findOneAndUpdate(query, userObject, { new: true }, callback);
};

module.exports.deleteAccount = (userId, callback) => {
  const query = { _id: userId };
  User.deleteOne(query, callback);
};
