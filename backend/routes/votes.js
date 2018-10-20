const express = require('express');
const router = express.Router();
const Vote = require('../models/vote');
const Answer = require('../models/answer');
const Comment = require('../models/comment');
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

router.post('/getuservotewithpostid', (req, res) => {
  const userId = req.body.userId;
  const postId = req.body.postId;
  Vote.getUserVoteWithPostId(userId, postId, (err, vote) => {
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
      res.json(vote);
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
    category: req.body.category,
    content: req.body.content,
    postId: req.body.postId
  });

  Vote.addNewVote(vote, (err, vote) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Äänestys epäonnistui' });
    } else {
      if (vote.category === 'Answer') {
        Answer.incrementPointTotal(vote.postId, vote.vote);
      }

      if (vote.category === 'Comment') {
        Comment.incrementPointTotal(vote.postId, vote.vote);
      }

      res.status(200);
      res.json({ success: true, msg: 'Ääni rekisteröity' });
    }
  });
});

router.post('/replacepreviousvote', (req, res) => {
  const vote = {
    userId: req.body.userId,
    username: req.body.username,
    vote: req.body.vote,
    category: req.body.category,
    content: req.body.content,
    postId: req.body.postId
  };
  Vote.replaceVote(vote, (err, vote) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Äänestys epäonnistui' });
    } else {
      if (vote.category === 'Answer') {
        Answer.incrementPointTotal(vote.postId, vote.vote);
      }

      if (vote.category === 'Comment') {
        Comment.incrementPointTotal(vote.postId, vote.vote);
      }
      res.status(200);
      res.json({ success: true, msg: 'Ääni rekisteröity' });
    }
  });
});

router.delete('/removevotes', (req, res) => {
  const deletedVotes = req.body;
  let deletedVoteIds = [];
  deletedVotes.forEach(vote => {
    deletedVoteIds.push(vote._id);
    vote.vote *= -1;
    if (vote.category === 'Answer') {
      Answer.incrementPointTotal(vote.postId, vote.vote);
    }

    if (vote.category === 'Comment') {
      Comment.incrementPointTotal(vote.postId, vote.vote);
    }
  });
  Vote.removeVotes(deletedVoteIds, (err, votes) => {
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
      res.json({ success: true, msg: 'Tykkäykset poistettu.' });
    }
  });
});

module.exports = router;
