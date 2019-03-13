const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const days = require('./routes/days');
const feedbacks = require('./routes/feedbacks');
const sharedDays = require('./routes/sharedDays');
const sharedMeals = require('./routes/sharedMeals');
const questions = require('./routes/questions');
const answers = require('./routes/answers');
const comments = require('./routes/comments');
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

const port = 1337;

server.use(cors());
server.use(express.json());
server.use('/admin', admin);
server.use('/api/v1/days', days);
server.use('/api/v1/feedbacks', feedbacks);
server.use('/api/v1/shareddays', sharedDays);
server.use('/api/v1/sharedmeals', sharedMeals);
server.use('/api/v1/qa/questions', questions);
server.use('/api/v1/qa/answers', answers);
server.use('/api/v1/qa/comments', comments);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
