const express = require('express');
const router = express.Router();
const multer = require('multer');
const stream = require('stream');
const winston = require('winston');
const clamav = require('clamav.js');
const path = require('path');

const tsFormat = () =>
  new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'scanner.error.log')
    })
  ]
});

const upload = multer({
  storage: multer.memoryStorage()
});

router.post('/scan', upload.single('img'), (req, res) => {
  const readStream = new stream.Readable();
  readStream.push(req.file.buffer);
  readStream.push(null);
  clamav
    .createScanner(3310, '127.0.0.1')
    .scan(readStream, (err, object, malicious) => {
      if (err) {
        console.log(err);
        logger.log({
          timestamp: tsFormat(),
          level: 'error',
          errorMsg: err
        });
        res.json({ success: false, clean: false });
      } else if (malicious) {
        res.json({ success: true, clean: false });
      } else {
        res.json({ success: true, clean: true });
      }
    });
});

module.exports = router;
