const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const foods = require('./routes/foods');
const editedFoods = require('./routes/editedFoods');
const admin = require('./routes/admin');
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

const port = 1338;

server.use(cors());
server.use(express.json());
server.use('/api/v1/foods', foods);
server.use('/api/v1/editedfoods', editedFoods);
server.use('/api/v1/admin', admin);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
