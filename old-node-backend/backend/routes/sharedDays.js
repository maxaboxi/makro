const express = require('express');
const router = express.Router();
const SharedDay = require('../models/sharedDay');
const winston = require('winston');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

const tsFormat = () => new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'days.error.log')
    })
  ]
});

function checkAuthorization() {
  return (req, res, next) => {
    if (req.path.includes('/getsharedday/') && req.method === 'GET') {
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
  };
}

router.use(checkAuthorization());

router.post('/shareday', (req, res) => {
  const day = new SharedDay({
    meals: req.body.meals,
    user: req.body.user
  });

  if (!day.user) {
    const token = jwt.decode(req.headers['authorization']);
    day.user = token.user;
  }

  SharedDay.saveSharedDay(day, (err, savedDay) => {
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
      res.json({ success: true, id: savedDay._id });
    }
  });
});

router.get('/getsharedday/:id', (req, res) => {
  const id = req.params.id;
  SharedDay.getSharedDay(id, (err, day) => {
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
      res.json(day);
    }
  });
});

router.get('/getdayssharedbyuser/:id', (req, res) => {
  const id = req.params.id;
  SharedDay.getDaysSharedByUser(id, (err, days) => {
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

router.delete('/removeshareddays', (req, res) => {
  const deletedDays = req.body;
  SharedDay.removeSharedDays(deletedDays, (err, days) => {
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
      res.json({ success: true, msg: 'Päivä(t) poistettu.' });
    }
  });
});

module.exports = router;