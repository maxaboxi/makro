const mongoose = require('mongoose');

const DaySchema = mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const Day = (module.exports = mongoose.model('Day', DaySchema));

module.exports.saveDay = (dayObject, callback) => {
  dayObject.save(callback);
};

module.exports.saveEditedDay = (day, callback) => {
  const query = { _id: day._id };
  Day.findByIdAndUpdate(query, day, { new: true }, callback);
};

module.exports.getDays = (username, callback) => {
  const query = { username: username };
  Day.find(query, callback);
};

module.exports.getAllDays = callback => {
  Day.find(callback);
};

module.exports.removeDays = (deletedDays, callback) => {
  const query = { _id: { $in: deletedDays } };
  Day.remove(query, callback);
};
