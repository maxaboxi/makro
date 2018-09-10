const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config.json');
const winston = require('winston');
const path = require('path');

const tsFormat = () =>
  new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'users.error.log')
    })
  ]
});

router.post('/register', (req, res) => {
  let newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({
        success: false,
        msg: 'Username is taken.'
      });
    } else {
      res.json({ success: true, msg: 'You are now registered.' });
    }
  });
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUserName(username, (err, user) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Something went wrong.' });
      return;
    }
    if (!user) {
      res.status(400);
      res.json({ success: false, msg: 'Wrong username or password.' });
      return;
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        logger.log({
          timestamp: tsFormat(),
          level: 'error',
          errorMsg: err
        });
      }
      if (isMatch) {
        const token = jwt.sign(
          { user: user.username, id: user._id },
          config['jwt'].secret,
          {
            expiresIn: 86400 // 24 hours
          }
        );
        res.status(200);
        res.json({
          success: true,
          token: token,
          user: {
            username: user.username,
            email: user.email,
            age: user.age,
            height: user.height,
            weight: user.weight,
            activity: user.activity,
            sex: user.sex,
            dailyExpenditure: user.dailyExpenditure,
            userAddedExpenditure: user.userAddedExpenditure,
            userAddedProteinTarget: user.userAddedProteinTarget,
            userAddedCarbTarget: user.userAddedCarbTarget,
            userAddedFatTarget: user.userAddedFatTarget,
            meals: user.meals
          }
        });
      } else {
        res.status(400);
        res.json({ success: false, msg: 'Wrong username or password.' });
      }
    });
  });
});

router.get('/getuserinfo', (req, res) => {
  const token = jwt.decode(req.headers['authorization']);
  const userId = token.id;
  User.getUserById(userId, (err, user) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Something went wrong.' });
    } else {
      res.status(200);
      res.json({
        success: true,
        user: {
          username: user.username,
          email: user.email,
          age: user.age,
          height: user.height,
          weight: user.weight,
          activity: user.activity,
          sex: user.sex,
          dailyExpenditure: user.dailyExpenditure,
          userAddedExpenditure: user.userAddedExpenditure,
          userAddedProteinTarget: user.userAddedProteinTarget,
          userAddedCarbTarget: user.userAddedCarbTarget,
          userAddedFatTarget: user.userAddedFatTarget,
          meals: user.meals
        }
      });
    }
  });
});

router.post('/updateuserinformation', (req, res) => {
  const token = jwt.decode(req.headers['authorization']);
  const userId = token.id;
  const userInfo = {
    username: req.body.username,
    email: req.body.email,
    age: req.body.age,
    height: req.body.height,
    weight: req.body.weight,
    activity: req.body.activity,
    sex: req.body.sex,
    dailyExpenditure: req.body.dailyExpenditure,
    userAddedExpenditure: req.body.userAddedExpenditure,
    userAddedProteinTarget: req.body.userAddedProteinTarget,
    userAddedCarbTarget: req.body.userAddedCarbTarget,
    userAddedFatTarget: req.body.userAddedFatTarget
  };
  User.updateUserInformation(userInfo, userId, (err, user) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Something went wrong.' });
    } else {
      res.status(200);
      res.json({
        success: true,
        user: {
          username: user.username,
          email: user.email,
          age: user.age,
          height: user.height,
          weight: user.weight,
          activity: user.activity,
          sex: user.sex,
          dailyExpenditure: user.dailyExpenditure,
          userAddedExpenditure: user.userAddedExpenditure,
          userAddedProteinTarget: user.userAddedProteinTarget,
          userAddedCarbTarget: user.userAddedCarbTarget,
          userAddedFatTarget: user.userAddedFatTarget,
          meals: user.meals
        }
      });
    }
  });
});

router.delete('/deleteaccount', (req, res) => {
  const token = jwt.decode(req.headers['authorization']);
  const userId = token.id;
  User.deleteAccount(userId, (err, callback) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Something went wrong.' });
    } else {
      res.status(200);
      res.json({ success: true, msg: 'Your account has been deleted.' });
    }
  });
});

router.post('/validatetoken', (req, res) => {
  const token = req.headers['authorization'];
  jwt.verify(token, config['jwt'].secret, (err, decoded) => {
    if (err) {
      res.status(200);
      res.json({ success: false, message: 'Token expired.' });
    } else {
      res.status(200);
      res.json({ success: true });
    }
  });
});

module.exports = router;
