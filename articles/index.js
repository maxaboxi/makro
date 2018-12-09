const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const articles = require('./routes/articles');

const server = express();

const port = 1339;

server.use(cors());
server.use(express.json({ limit: '2mb' }));
server.use('/api/v1/articles', articles);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
