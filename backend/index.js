const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const users = require('./routes/users');
const foods = require('./routes/foods');
const days = require('./routes/days');
const feedbacks = require('./routes/feedbacks');
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

const port = 1337;

server.use(cors());
server.use(express.json());
server.use('/auth', users);
server.use('/api/v1', foods, days, feedbacks);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
