const express = require('express');
const router = express.Router();
const sharedMeal = require('../models/sharedMeal');
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
      filename: path.join(__dirname, '../logs', 'sharedMeals.error.log')
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

router.post('/addnewsharedmeal', (req, res) => {
  const meal = new sharedMeal({
    username: req.body.username,
    name: req.body.name,
    info: req.body.info,
    foods: req.body.foods
  });

  sharedMeal.saveMeal(meal, (err, meal) => {
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

router.post('/saveeditedsharedmeal', (req, res) => {
  const meal = new sharedMeal({
    _id: req.body._id,
    name: req.body.name,
    info: req.body.info,
    foods: req.body.foods
  });

  sharedMeal.saveEditedMeal(meal, (err, meal) => {
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

router.get('/getsharedmeals/:username', (req, res) => {
  const username = req.params.username;
  sharedMeal.getMealsByUser(username, (err, meals) => {
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

router.get('/getallsharedmeals', (req, res) => {
  sharedMeal.getAllMeals((err, meals) => {
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

router.delete('/removesharedmeals', (req, res) => {
  const deletedMeals = req.body;
  sharedMeal.removeMeals(deletedMeals, (err, meals) => {
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
