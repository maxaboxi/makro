const express = require('express');
const router = express.Router();
const EditedFood = require('../models/editedFood');
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
      filename: path.join(__dirname, '../logs', 'editedFoods.error.log')
    })
  ]
});

function checkAuthorization() {
  return (req, res, next) => {
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
      res.status(200);
      res.json({ success: false, message: 'Unauthorized' });
    }
  };
}

router.use(checkAuthorization());

router.post('/sendforapproval', (req, res) => {
  const foods = req.body.foods;
  console.log(foods);

  EditedFood.saveFoods(foods, (err, foods) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Something went wrong' });
    } else {
      res.status(200);
      res.json({ success: true, msg: 'Saved' });
    }
  });
});

module.exports = router;
