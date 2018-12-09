const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Article = require('../models/Article');
const winston = require('winston');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const config = require('../config/config.json');
const Grid = require('gridfs-stream');
const options = {
  autoReconnect: true,
  useNewUrlParser: true,
  authSource: 'admin'
};

let gfs;
mongoose
  .connect(
    config['database'].url,
    options
  )
  .then(() => {
    console.log('Connected to MongoDB');
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('images');
  })
  .catch(err => console.log(err));

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

const storage = new GridFsStorage({
  url: config['database'].url,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          logger.log({
            timestamp: tsFormat(),
            level: 'error',
            errorMsg: err
          });
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'images'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage: storage }).single('img');

router.use((req, res, next) => {
  if (req.path === '/getallarticles' && req.method === 'GET') {
    next();
  } else {
    let token;
    if (req.headers['authorization']) {
      token = jwt.decode(req.headers['authorization']);
      if (token) {
        next();
      } else {
        res.status(401);
        res.json({ success: false, msg: 'Unauthorized' });
        return;
      }
    } else {
      res.status(401);
      res.json({ success: false, msg: 'Unauthorized' });
      return;
    }
  }
});

router.post('/addnewarticle', (req, res) => {
  const article = new Article({
    username: req.body.username,
    title: req.body.title,
    body: req.body.body,
    imgId: req.body.img,
    tags: req.body.tags
  });

  Article.saveArticle(article, (err, article) => {
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

router.post('/addimagetoarticle', upload, (req, res) => {
  if (req.file) {
    return res.json({
      success: true,
      file: req.file.id
    });
  }
});

router.post('/editedarticle', (req, res) => {
  const article = new Article({
    _id: req.body._id,
    title: req.body.title,
    body: req.body.body,
    tags: req.body.tags
  });

  Article.saveEditedArticle(article, (err, article) => {
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
  Article.getArticlesByUser(username, (err, articles) => {
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
      res.json(articles);
    }
  });
});

router.get('/getallarticles', (req, res) => {
  Article.getAllArticles((err, articles) => {
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
      res.json(articles);
    }
  });
});

router.delete('/removearticles', (req, res) => {
  const deletedArticles = req.body;
  Article.removeArticles(deletedArticles, (err, articles) => {
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
      res.json({ success: true, msg: 'Artikkeli(t) poistettu.' });
    }
  });
});

router.delete('/removearticleimages', (req, res) => {
  console.log('kuva');
  const oldImages = req.body;
  for (const img of oldImages) {
    gfs.remove({ _id: img }, (err, gridStore) => {
      if (err) {
        console.log(err);
      } else {
        console.log('suc');
      }
    });
  }
});

module.exports = router;
