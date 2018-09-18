const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');
const winston = require('winston');
const path = require('path');
const jwt = require('jsonwebtoken');

const tsFormat = () =>
  new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'foods.error.log')
    })
  ]
});

router.use((req, res, next) => {
  let token;
  if (req.headers['authorization']) {
    token = jwt.decode(req.headers['authorization']);
    if (token) {
      next();
    }
  } else {
    res.status(401);
    res.json({ success: false, msg: 'Unauthorized' });
    return;
  }
});

router.post('/addnewfeedback', (req, res) => {
  const feedback = new Feedback({
    feedback: req.body.feedback,
    username: req.body.username
  });

  Feedback.saveFeedback(feedback, (err, feedback) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Palautteen tallennus epäonnistui.' });
    } else {
      res.status(200);
      res.json({ success: true, msg: 'Palautteen tallennus onnistui.' });
    }
  });
});

router.get('/getallfeedbacks', (req, res) => {
  Feedback.getFeedbacks((err, feedbacks) => {
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
      res.json(feedbacks);
    }
  });
});

module.exports = router;
