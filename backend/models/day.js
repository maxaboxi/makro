const mongoose = require('mongoose');

const DaySchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  meals: {
    type: Array,
    required: true
  }
});

const Day = (module.exports = mongoose.model('Day', DaySchema));

module.exports.saveDay = (dayObject, callback) => {
  dayObject.save(callback);
};

module.exports.getDays = (username, callback) => {
  const query = { username: username };
  Day.find(query, callback);
};

module.exports.removeDays = (deletedDays, callback) => {
  const query = { _id: { $in: deletedDays } };
  Day.remove(query, callback);
};
