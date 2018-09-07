const express = require('express');
const router = express.Router();
const Food = require('../models/food');
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
      filename: path.join(__dirname, '../logs', 'foods.error.log')
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

router.get('/getallfoods', (req, res) => {
  Food.getFoods((err, foods) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Unable to fetch foods' });
    } else {
      res.status(200);
      // Fix in DB
      foods.forEach(food => {
        food.energia /= 4.1868;
      });
      res.json(foods);
    }
  });
});

router.post('/savefood', (req, res, next) => {
  const newFood = new Food({
    name: req.body.name,
    energia: req.body.energia,
    hh: req.body.hh,
    rasva: req.body.rasva,
    proteiini: req.body.proteiini,
    kuitu: req.body.kuitu,
    sokeri: req.body.sokeri,
    username: req.body.username
  });

  Food.addFood(newFood, (err, food) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Ruoan lisäys epäonnistui.' });
    } else {
      res.status(200);
      res.json({ success: true, msg: 'Ruoan lisäys onnistui.' });
    }
  });
});

router.delete('/removefood/:id', (req, res, next) => {
  const foodId = req.params.id;
  Food.removeFood(foodId, (err, food) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Ruoan poisto epäonnistui.' });
    } else {
      res.status(200);
      res.json({ success: true, msg: 'Ruoka poistettu.' });
    }
  });
});

module.exports = router;
