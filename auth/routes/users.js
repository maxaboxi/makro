const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config.json');
const winston = require('winston');
const path = require('path');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const tsFormat = () =>
  new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'users.error.log')
    })
  ]
});

const emailLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'emails.error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'emails.info.log')
    })
  ]
});

function checkAuthorization() {
  return (req, res, next) => {
    if (
      (req.path === '/login' && req.method === 'POST') ||
      (req.path === '/register' && req.method === 'POST') ||
      (req.path === '/resetpassword' && req.method === 'POST')
    ) {
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

function sendNewPassword(password, receiver) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email.user,
      pass: config.email.pass
    }
  });
  const mailOptions = {
    from: config.email.user,
    to: receiver,
    subject: 'Uusi salasanasi',
    html: `<p>Uusi salasanasi on: ${password}</p><p>Terveisin</p><p>Makro Support</p>`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      emailLogger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
    } else {
      emailLogger.log({
        timestamp: tsFormat(),
        level: 'info',
        infoMsg: info
      });
    }
  });
}

router.use(checkAuthorization());

router.post('/register', (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({
        success: false,
        msg: 'Käyttäjätunnus on jo käytössä.'
      });
    } else {
      res.json({ success: true, msg: 'Rekisteröityminen onnistui.' });
    }
  });
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUserName(username, (err, user) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Something went wrong.' });
      return;
    }
    if (!user) {
      res.status(400);
      res.json({
        success: false,
        msg: 'Väärä käyttäjätunnus ja/tai salasana.'
      });
      return;
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        logger.log({
          timestamp: tsFormat(),
          level: 'error',
          errorMsg: err
        });
      }
      if (isMatch) {
        User.updateLastLogin(username);
        const token = jwt.sign(
          { user: user.username, id: user._id },
          config['jwt'].secret,
          {
            expiresIn: 86400 // 24 hours
          }
        );
        res.status(200);
        res.json({
          success: true,
          token: token,
          user: {
            username: user.username,
            email: user.email,
            age: user.age,
            height: user.height,
            weight: user.weight,
            activity: user.activity,
            sex: user.sex,
            dailyExpenditure: user.dailyExpenditure,
            userAddedExpenditure: user.userAddedExpenditure,
            userAddedProteinTarget: user.userAddedProteinTarget,
            userAddedCarbTarget: user.userAddedCarbTarget,
            userAddedFatTarget: user.userAddedFatTarget,
            meals: user.meals
          }
        });
      } else {
        res.status(400);
        res.json({
          success: false,
          msg: 'Väärä käyttäjätunnus ja/tai salasana.'
        });
      }
    });
  });
});

router.get('/getuserinfo', (req, res) => {
  const token = jwt.decode(req.headers['authorization']);
  const userId = token.id;
  User.getUserById(userId, (err, user) => {
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
      res.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          age: user.age,
          height: user.height,
          weight: user.weight,
          activity: user.activity,
          sex: user.sex,
          dailyExpenditure: user.dailyExpenditure,
          userAddedExpenditure: user.userAddedExpenditure,
          userAddedProteinTarget: user.userAddedProteinTarget,
          userAddedCarbTarget: user.userAddedCarbTarget,
          userAddedFatTarget: user.userAddedFatTarget,
          meals: user.meals
        }
      });
    }
  });
});

router.post('/updateuserinformation', (req, res) => {
  const token = jwt.decode(req.headers['authorization']);
  const userId = token.id;
  const userInfo = {
    username: req.body.username,
    email: req.body.email,
    age: req.body.age,
    height: req.body.height,
    weight: req.body.weight,
    activity: req.body.activity,
    sex: req.body.sex,
    dailyExpenditure: req.body.dailyExpenditure,
    userAddedExpenditure: req.body.userAddedExpenditure,
    userAddedProteinTarget: req.body.userAddedProteinTarget,
    userAddedCarbTarget: req.body.userAddedCarbTarget,
    userAddedFatTarget: req.body.userAddedFatTarget,
    meals: req.body.meals
  };
  User.updateUserInformation(userInfo, userId, (err, user) => {
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
      res.json({
        success: true,
        user: {
          username: user.username,
          email: user.email,
          age: user.age,
          height: user.height,
          weight: user.weight,
          activity: user.activity,
          sex: user.sex,
          dailyExpenditure: user.dailyExpenditure,
          userAddedExpenditure: user.userAddedExpenditure,
          userAddedProteinTarget: user.userAddedProteinTarget,
          userAddedCarbTarget: user.userAddedCarbTarget,
          userAddedFatTarget: user.userAddedFatTarget,
          meals: user.meals
        }
      });
    }
  });
});

router.post('/updatepassword', (req, res) => {
  const userId = req.body._id;
  const user = {
    password: req.body.password
  };

  bcrypt.genSalt(12, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        logger.log({
          timestamp: tsFormat(),
          level: 'error',
          errorMsg: err
        });
      }
      user.password = hash;
      User.updateUserInformation(user, userId, (error, callback) => {
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
          res.json({ success: true, msg: 'Salasana vaihdettu.' });
        }
      });
    });
  });
});

router.post('/resetpassword', (req, res) => {
  const username = req.body.username;
  User.getUserByUserName(username, (err, user) => {
    if (err) {
      logger.log({
        timestamp: tsFormat(),
        level: 'error',
        errorMsg: err
      });
      res.status(500);
      res.json({ success: false, msg: 'Something went wrong.' });
    } else {
      if (!user) {
        res.status(200);
        res.json({
          success: false,
          msg:
            'Väärä käyttäjätunnus tai käyttäjätunnukseen ei ole liitetty sähköpostia.'
        });
        return;
      }
      const password =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      bcrypt.genSalt(12, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            logger.log({
              timestamp: tsFormat(),
              level: 'error',
              errorMsg: err
            });
          }
          user.password = hash;
          User.updateUserInformation(user, user._id, (error, callback) => {
            if (error) {
              logger.log({
                timestamp: tsFormat(),
                level: 'error',
                errorMsg: err
              });
              res.status(500);
              res.json({ success: false, msg: 'Something went wrong.' });
            } else {
              sendNewPassword(password, user.email);
              res.status(200);
              res.json({
                success: true,
                msg:
                  'Salasana vaihdettu ja uusi salasana lähetetty sähköpostilla.'
              });
            }
          });
        });
      });
    }
  });
});

router.delete('/deleteaccount', (req, res) => {
  const token = jwt.decode(req.headers['authorization']);
  const userId = token.id;
  User.deleteAccount(userId, (err, callback) => {
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
      res.json({ success: true, msg: 'Your account has been deleted.' });
    }
  });
});

router.post('/validatetoken', (req, res) => {
  const token = req.headers['authorization'];
  jwt.verify(token, config['jwt'].secret, (err, decoded) => {
    if (err) {
      res.status(200);
      res.json({ success: false, message: 'Token expired.' });
    } else {
      res.status(200);
      res.json({ success: true });
    }
  });

  router.post('/checkadmin', (req, res) => {
    const token = jwt.decode(req.headers['authorization']);
    const userId = token.id;
    User.getUserById(userId, (err, user) => {
      if (err) {
        logger.log({
          timestamp: tsFormat(),
          level: 'error',
          errorMsg: err
        });
        res.status(500);
        res.json(false);
      } else {
        if (user.role === 'admin') {
          res.status(200);
          res.json(true);
        } else {
          res.status(200);
          res.json(false);
        }
      }
    });
  });
});

module.exports = router;
