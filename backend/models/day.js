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

// Save new dayobject to database
module.exports.saveDay = (dayObject, callback) => {
  dayObject.save(callback);
};

// Find days based on username
module.exports.getDays = (username, callback) => {
  let query = { username: username };
  Day.find(query, callback);
};

// Delete day
module.exports.removeDay = (dayName, callback) => {
  let query = { name: dayName };
  Day.remove(query, callback);
};
