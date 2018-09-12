const express = require('express');
const router = express.Router();
const Day = require('../models/day');
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
      filename: path.join(__dirname, '../logs', 'days.error.log')
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

router.post('/addnewday', (req, res) => {
  let dayObject = new Day({
    username: req.body.username,
    name: req.body.name,
    meals: req.body.meals
  });

  Day.saveDay(dayObject, (err, day) => {
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

router.get('/getalldays/:username', (req, res) => {
  const username = req.params.username;
  Day.getDays(username, (err, days) => {
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

router.delete('/removedays', (req, res) => {
  const deletedDays = req.body;
  Day.removeDays(deletedDays, (err, days) => {
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
      res.json({ success: true, msg: 'Päivä poistettu.' });
    }
  });
});

module.exports = router;
