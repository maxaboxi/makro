const express = require('express');
const cors = require('cors');
const scanner = require('./routes/scan');

const server = express();

const port = 1330;

server.use(cors());
server.use('/scanner', scanner);

server.listen(port, () => {
  console.log(`Scanner started on port ${port}`);
});
