const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
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
      filename: path.join(__dirname, '../logs', 'articles.error.log')
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

router.post('/addnewarticle', (req, res) => {
  const meal = new Article({
    username: req.body.username,
    title: req.body.title,
    body: req.body.body,
    img: req.body.img,
    tags: req.body.tags
  });

  Article.saveArticle(meal, (err, meal) => {
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

router.post('/saveeditedarticle', (req, res) => {
  const meal = new Article({
    _id: req.body._id,
    title: req.body.title,
    body: req.body.body,
    img: req.body.img,
    tags: req.body.tags
  });

  Article.saveEditedArticle(meal, (err, meal) => {
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

router.get('/getarticles/:username', (req, res) => {
  const username = req.params.username;
  Article.getArticlesByUser(username, (err, meals) => {
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
      res.json(meals);
    }
  });
});

router.get('/getallarticles', (req, res) => {
  Article.getAllArticles((err, meals) => {
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
      res.json(meals);
    }
  });
});

router.delete('/removearticles', (req, res) => {
  const deletedArticles = req.body;
  Article.removeArticles(deletedArticles, (err, meals) => {
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
      res.json({ success: true, msg: 'Ateria(t) poistettu.' });
    }
  });
});

module.exports = router;
