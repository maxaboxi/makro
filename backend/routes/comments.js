const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
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

router.get('/getallcomments/:id', (req, res) => {
  const postId = req.params.id;
  Comment.getAllCommentsWithId(postId, (err, comments) => {
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

router.post('/addcomment', (req, res) => {
  const comment = new Comment({
    username: req.body.username,
    comment: req.body.comment,
    postId: req.body.postId
  });

  Comment.addNewComment(comment, (err, cb) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Kommentin lisääminen epäonnistui' });
    } else {
      res.status(200);
      res.json({ success: true, msg: 'Kommentti lisätty.' });
    }
  });
});
