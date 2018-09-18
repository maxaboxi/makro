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
