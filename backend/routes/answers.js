const express = require('express');
const router = express.Router();
const Answer = require('../models/answer');
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
      filename: path.join(__dirname, '../logs', 'answers.error.log')
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

router.post('/addanswertoquestion', (req, res) => {
  const answer = new Answer({
    username: req.body.username,
    answer: req.body.answer,
    questionId: req.body.questionId,
    origPost: req.body.origPost
  });

  Answer.saveAnswer(answer, (err, answer) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Vastauksen lisääminen epäonnistui' });
    } else {
      res.status(200);
      res.json({ success: true, msg: 'Vastaus lisätty.' });
    }
  });
});

router.post('/getallresponsestoquestion', (req, res) => {
  const questionId = req.body.questionId;
  Answer.getAllAnswers(questionId, (err, answers) => {
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

router.post('/gettopresponsetoquestion', (req, res) => {
  const questionId = req.body.questionId;
  Answer.getTopAnswer(questionId, (err, answer) => {
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
      res.json(answer);
    }
  });
});

router.post('/editanswer', (req, res) => {
  const answer = new Answer({
    _id: req.body._id,
    username: req.body.username,
    answer: req.body.answer,
    questionId: req.body.questionId
  });
  Answer.editAnswer(answer, (err, cb) => {
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
      res.json({ success: true, msg: 'Muutokset tallennettu.' });
    }
  });
});

router.get('/getallanswerswithusername/:name', (req, res) => {
  const username = req.params.name;
  Answer.getAllAnswersWithUsername(username, (err, answers) => {
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

router.delete('/removeanswers', (req, res) => {
  const deletedAnswers = req.body;
  Answer.removeAnswers(deletedAnswers, (err, answers) => {
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
      res.json({ success: true, msg: 'Vastaukset poistettu.' });
    }
  });
});

module.exports = router;
