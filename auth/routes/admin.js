const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const winston = require('winston');
const path = require('path');
const bcrypt = require('bcryptjs');

const tsFormat = () =>
  new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'admin.error.log')
    })
  ]
});

router.use((req, res, next) => {
  if (req.headers['authorization']) {
    const token = jwt.decode(req.headers['authorization']);
    const userId = token.id;
    User.getUserById(userId, (err, user) => {
      if (err) {
        logger.log({
          timestamp: tsFormat(),
          level: 'error',
          errorMsg: err
        });
        res.status(401);
        res.json({ success: false, msg: 'Unauthorized' });
      } else {
        if (user.role === 'admin') {
          next();
        } else {
          res.status(401);
          res.json({ success: false, msg: 'Unauthorized' });
        }
      }
    });
  } else {
    res.status(401);
    res.json({ success: false, msg: 'Unauthorized' });
    return;
  }
});

router.get('/getallusers', (req, res) => {
  User.getAllUsers((err, users) => {
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
      res.json(users);
    }
  });
});

router.post('/updateuserinformation', (req, res) => {
  const userId = req.body._id;
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
    userAddedFatTarget: req.body.userAddedFatTarget,
    meals: req.body.meals
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
        msg: 'Käyttäjän tiedot päivitetty'
      });
    }
  });
});

router.post('/updateuserpassword', (req, res) => {
  const userId = req.body._id;
  const user = {
    password: req.body.password
  };

  bcrypt.genSalt(12, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        logger.log({
          timestamp: tsFormat(),
          level: 'error',
          errorMsg: err
        });
      }
      user.password = hash;
      User.updateUserInformation(user, userId, (error, callback) => {
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
          res.json({ success: true, msg: 'Salasana vaihdettu.' });
        }
      });
    });
  });
});

router.delete('/removeusers', (req, res) => {
  const deletedUsers = req.body;
  User.removeUsers(deletedUsers, (err, users) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Poisto epäonnistui.' });
    } else {
      res.status(200);
      res.json({ success: true, msg: 'Käyttäjät poistettu.' });
    }
  });
});

module.exports = router;
