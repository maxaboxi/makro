const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Food = require('../models/food');
const EditedFood = require('../models/editedFood');
const winston = require('winston');
const path = require('path');

const tsFormat = () => new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'admin.error.log')
    })
  ]
});

router.use((req, res, next) => {
  if (req.headers['authorization']) {
    const token = jwt.decode(req.headers['authorization']);
    const userId = token.id;
    User.getUserById(userId, (err, user) => {
      if (err) {
        logger.log({
          timestamp: tsFormat(),
          level: 'error',
          errorMsg: err
        });
        res.status(401);
        res.json({ success: false, msg: 'Unauthorized' });
      } else {
        if (user.role === 'admin') {
          next();
        } else {
          res.status(401);
          res.json({ success: false, msg: 'Unauthorized' });
        }
      }
    });
  } else {
    res.status(401);
    res.json({ success: false, msg: 'Unauthorized' });
    return;
  }
});

router.get('/getallsentforapproval', (req, res) => {
  EditedFood.getAllFoods((err, foods) => {
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
      res.json(foods);
    }
  });
});

router.post('/approve', (req, res) => {
  const editedFood = req.body;
  editedFood.editedFood.reasonForEditing = '';
  editedFood.editedFood.waitingForApproval = false;
  Food.editFood(editedFood.editedFood, (err, food) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Tietojen tallennus epäonnistui.' });
    } else {
      EditedFood.removeEditedFoods([editedFood._id], (err, foods) => {
        if (err) {
          logger.log({
            timestamp: tsFormat(),
            level: 'error',
            errorMsg: err
          });
          res.status(500);
          res.json({ success: false, msg: 'Muokatun ruoan poisto epäonnistui.' });
          return;
        }
      });
      res.status(200);
      res.json({ success: true, msg: 'Tietojen tallennus onnistui.' });
    }
  });
});

router.delete('/disapprove', (req, res) => {
  const deletedFoods = req.body;
  let editedFoodIds = [];
  let originalFoodIds = [];
  deletedFoods.forEach(f => {
    editedFoodIds.push(f._id);
    originalFoodIds.push(f.editedFood._id);
  });
  EditedFood.removeEditedFoods(editedFoodIds, (err, foods) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Poisto epäonnistui.' });
    } else {
      Food.updateWaitingForApproval(originalFoodIds, false, (err, foods) => {
        if (err) {
          logger.log({
            timestamp: tsFormat(),
            level: 'error',
            errorMsg: err
          });
          res.status(500);
          res.json({ success: false, msg: 'Ruoan tietojen päivittäminen epäonnistui.' });
          return;
        }
      });
      res.status(200);
      res.json({ success: true, msg: 'Ruoat poistettu.' });
    }
  });
});

module.exports = router;
