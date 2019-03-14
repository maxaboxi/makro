const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Article = require('../models/article');
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

const tsFormat = () => new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'articles.error.log')
    })
  ]
});

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

const storage = new GridFsStorage({
  url: config['database'].url,
  options,
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
  if ((req.path === '/getallarticles' && req.method === 'GET') || (req.path.indexOf('/articleimage/') > -1 && req.method === 'GET')) {
    next();
  } else {
    if (req.headers['authorization']) {
      const token = req.headers['authorization'];
      jwt.verify(token, config['jwt'].secret, (err, decoded) => {
        if (err) {
          res.status(200);
          res.json({ success: false, message: 'Unauthorized' });
        } else {
          next();
        }
      });
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
    headerImgId: req.body.headerImgId,
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
    res.status(200);
    return res.json({
      success: true,
      file: req.file.id
    });
  } else {
    return res.json({ success: false });
  }
});

router.post('/editarticle', (req, res) => {
  const id = mongoose.Types.ObjectId(req.body._id);
  const article = {
    title: req.body.title,
    origTitle: req.body.origTitle,
    body: req.body.body,
    origBody: req.body.origBody,
    headerImgId: req.body.headerImgId,
    tags: req.body.tags
  };

  Article.saveEditedArticle(id, article, (err, ar) => {
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

router.get('/getarticle/:id', (req, res) => {
  const id = req.params.id;
  Article.getArticleById(id, (err, article) => {
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
      res.json(article);
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

router.get('/articleimage/:img', (req, res) => {
  const imgId = mongoose.Types.ObjectId(req.params.img);
  gfs.files.findOne({ _id: imgId }, (err, img) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Something went wrong.' });
    }
    if (img && img.filename) {
      const readstream = gfs.createReadStream(img.filename);
      res.status(200);

      res.set('Content-Type', img.contentType);
      res.set('Content-Disposition', 'attachment; filename="' + img.filename + '"');

      readstream.pipe(res);
    } else {
      res.json({ success: false, msg: 'No image found' });
    }
  });
});

router.delete('/removearticle/:id', (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  Article.removeArticle(id, (err, article) => {
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
      res.json({ success: true, msg: 'Artikkeli poistettu.' });
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
  const oldImages = req.body;
  for (const img of oldImages) {
    gfs.remove({ _id: img }, (err, gridStore) => {
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
        res.json({ success: true });
      }
    });
  }
});

module.exports = router;
