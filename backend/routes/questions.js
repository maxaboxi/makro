const express = require('express');
const router = express.Router();
const Question = require('../models/question');
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

router.post('/postnewquestion', (req, res) => {
  const question = new Question({
    username: req.body.username,
    question: req.body.question,
    info: req.body.info,
    tags: req.body.tags
  });

  Question.saveQuestion(question, (err, question) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Kysymyksen lisääminen epäonnistui' });
    } else {
      res.status(200);
      res.json({ success: true, msg: 'Kysymys lisätty.' });
    }
  });
});

router.get('/getallquestions', (req, res) => {
  Question.getAllQuestions((err, questions) => {
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
      res.json(questions);
    }
  });
});

router.get('/getquestion/:id', (req, res) => {
  const id = req.params.id;
  Question.getQuestionWithId(id, (err, question) => {
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
      res.json(question);
    }
  });
});

router.get('/getallquestionswithusername/:name', (req, res) => {
  const username = req.params.name;
  Question.getAllQuestionsWithUsername(username, (err, questions) => {
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
      res.json(questions);
    }
  });
});

router.delete('/removequestions', (req, res) => {
  const deletedQuestions = req.body;
  Question.removeQuestions(deletedQuestions, (err, questions) => {
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
      res.json({ success: true, msg: 'Kysymykset poistettu.' });
    }
  });
});

module.exports = router;
