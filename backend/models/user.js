const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const winston = require('winston');
const path = require('path');

const tsFormat = () =>
  new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'user.error.log')
    })
  ]
});

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

module.exports.getUserByUserName = (username, callback) => {
  const query = { username: username };
  User.findOne(query, callback);
};

module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(12, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        logger.log({
          timestamp: tsFormat(),
          level: 'error',
          errorMsg: err
        });
      }
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
    }
    callback(null, isMatch);
  });
};

module.exports.updateUserInformation = (userObject, userId, callback) => {
  const query = { _id: userId };
  User.findOneAndUpdate(query, userObject, { new: true }, callback);
};

module.exports.deleteAccount = (userId, callback) => {
  const query = { _id: userId };
  User.deleteOne(query, callback);
};

module.exports.updateLastLogin = username => {
  const query = { username: username };
  User.findOneAndUpdate(query, { lastLogin: Date.now() }).exec();
};
