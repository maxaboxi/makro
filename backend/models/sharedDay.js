const mongoose = require('mongoose');

const SharedDaySchema = mongoose.Schema(
  {
    meals: {
      type: Array,
      required: true
    }
  },
  { timestamps: true }
);

const SharedDay = (module.exports = mongoose.model(
  'SharedDay',
  SharedDaySchema
));

module.exports.saveSharedDay = (day, callback) => {
  day.save(callback);
};

module.exports.getSharedDay = (dayId, callback) => {
  const query = { _id: dayId };
  SharedDay.findById(query, callback);
};
