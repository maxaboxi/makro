const express = require('express');
const router = express.Router();
const SharedDay = require('../models/sharedDay');
const winston = require('winston');
const path = require('path');

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

router.post('/shareday', (req, res) => {
  const day = new SharedDay({
    meals: req.body
  });

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

module.exports = router;
