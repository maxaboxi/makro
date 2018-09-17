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

function checkAuthorization() {
  return (req, res, next) => {
    if (req.path === '/getallfoods' && req.method === 'GET') {
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
  };
}

router.use(checkAuthorization());

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
      res.json(foods);
    }
  });
});

router.get('/getfoods/:user', (req, res) => {
  const user = req.params.user;
  Food.getUserFoods(user, (err, foods) => {
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
      res.json(foods);
    }
  });
});

router.get('/getfoodsbyuser/:user', (req, res) => {
  const user = req.params.user;
  Food.foodsByUser(user, (err, foods) => {
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
      res.json(foods);
    }
  });
});

router.post('/addnewfood', (req, res) => {
  const newFood = new Food({
    name: req.body.name,
    energia: req.body.energia,
    hh: req.body.hh,
    rasva: req.body.rasva,
    proteiini: req.body.proteiini,
    kuitu: req.body.kuitu,
    sokeri: req.body.sokeri,
    servingSize: req.body.servingSize,
    packageSize: req.body.packageSize,
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

router.post('/editfood', (req, res) => {
  const updatedFood = new Food({
    _id: req.body._id,
    name: req.body.name,
    energia: req.body.energia,
    hh: req.body.hh,
    rasva: req.body.rasva,
    proteiini: req.body.proteiini,
    kuitu: req.body.kuitu,
    sokeri: req.body.sokeri,
    servingSize: req.body.servingSize,
    packageSize: req.body.packageSize
  });

  Food.editFood(updatedFood, (err, food) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Ruoan muokkaus epäonnistui.' });
    } else {
      res.status(200);
      res.json({ success: true, msg: 'Ruoan muokkaus onnistui.' });
    }
  });
});

router.delete('/removefoods/', (req, res) => {
  const deletedFoods = req.body;
  Food.removeFoods(deletedFoods, (err, foods) => {
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
      res.json({ success: true, msg: 'Ruoka/ruoat poistettu.' });
    }
  });
});

module.exports = router;
