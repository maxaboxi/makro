const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const articles = require('./routes/articles');
const config = require('./config/config.json');
const options = {
  autoReconnect: true,
  useNewUrlParser: true,
  authSource: 'admin'
};

mongoose
  .connect(
    config['database'].url,
    options
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

const server = express();

const port = 1339;

server.use(cors());
server.use(express.json());
server.use('/api/v1/articles', foods);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
