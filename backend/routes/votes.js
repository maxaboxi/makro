const express = require('express');
const router = express.Router();
const Vote = require('../models/vote');
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
      filename: path.join(__dirname, '../logs', 'votes.error.log')
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

router.get('/getallvoteswithpostid/:id', (req, res) => {
  const postId = req.params.id;
  Vote.getAllVotesWithPostId(postId, (err, comments) => {
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

router.get('/getallvoteswithuserid/:id', (req, res) => {
  const userId = req.params.id;
  Vote.getAllVotesWithUserId(userId, (err, votes) => {
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

router.post('/votepost', (req, res) => {
  const vote = new Vote({
    userId: req.body.userId,
    username: req.body.username,
    vote: req.body.vote,
    postId: req.body.postId
  });

  Vote.addNewVote(vote, (err, cb) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Äänestys epäonnistui' });
    } else {
      res.status(200);
      res.json({ success: true, msg: 'Ääni rekisteröity' });
    }
  });
});

router.post('/replacepreviousvote', (req, res) => {
  const vote = new Vote({
    userId: req.body.userId,
    username: req.body.username,
    vote: req.body.vote,
    postId: req.body.postId
  });

  Vote.replaceVote(vote, (err, cb) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Äänestys epäonnistui' });
    } else {
      res.status(200);
      res.json({ success: true, msg: 'Ääni rekisteröity' });
    }
  });
});

module.exports = router;
