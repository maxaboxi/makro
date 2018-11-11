const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Day = require('../models/day');
const SharedDay = require('../models/sharedDay');
const Feedback = require('../models/feedback');
const Vote = require('../models/vote');
const Comment = require('../models/comment');
const Answer = require('../models/answer');
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

router.get('/getalldays', (req, res) => {
  Day.getAllDays((err, days) => {
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
      res.json(days);
    }
  });
});

router.get('/getallshareddays', (req, res) => {
  SharedDay.getAllSharedDays((err, days) => {
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
      res.json(days);
    }
  });
});

router.get('/getallanswers', (req, res) => {
  Answer.getAllAnswers((err, answers) => {
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
      res.json(answers);
    }
  });
});

router.get('/getallcomments', (req, res) => {
  Comment.getAllComments((err, comments) => {
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
      res.json(comments);
    }
  });
});

router.get('/getallvotes', (req, res) => {
  Vote.getAllVotes((err, votes) => {
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
      res.json(votes);
    }
  });
});

router.post('/answertofeedback', (req, res) => {
  const feedback = new Feedback({
    _id: req.body._id,
    feedback: req.body.feedback,
    username: req.body.username,
    answer: req.body.answer,
    answerUsername: req.body.answerUsername,
    answerDate: Date.now()
  });

  Feedback.saveAnswer(feedback, (err, feedback) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Tietojen tallennus epäonnistui.' });
    } else {
      res.status(200);
      res.json({ success: true, msg: 'Tietojen tallennus onnistui.' });
    }
  });
});

router.delete('/removefeedbacks', (req, res) => {
  const deletedFeedbacks = req.body;
  Feedback.removeFeedbacks(deletedFeedbacks, (err, feedbacks) => {
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
      res.json({ success: true, msg: 'Palautteet poistettu.' });
    }
  });
});

module.exports = router;
