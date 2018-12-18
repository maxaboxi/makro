const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const winston = require('winston');
const path = require('path');
const jwt = require('jsonwebtoken');

const tsFormat = () => new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'comments.error.log')
    })
  ]
});

router.use((req, res, next) => {
  if (req.path.indexOf('/getallcomments/') > -1 && req.method === 'GET') {
    next();
  } else {
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
    userId: req.body.userId,
    comment: req.body.comment,
    postId: req.body.postId,
    articleId: req.body.articleId,
    replyTo: req.body.replyTo,
    origPost: req.body.origPost,
    articleId: req.body.articleId
  });

  if (!comment.username) {
    console.log(comment);
    const token = jwt.decode(req.headers['authorization']);
    console.log(token);
  }

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

router.get('/getallcommentswithuserid/:id', (req, res) => {
  const userId = req.params.id;
  Comment.getAllCommentsWithUserId(userId, (err, comments) => {
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

router.delete('/removecomments', (req, res) => {
  const deletedComments = req.body;
  Comment.removeComments(deletedComments, (err, comments) => {
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
      res.json({ success: true, msg: 'Kommentit poistettu.' });
    }
  });
});

module.exports = router;
