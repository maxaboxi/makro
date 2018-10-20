const mongoose = require('mongoose');

const SharedDaySchema = mongoose.Schema(
  {
    meals: {
      type: Array,
      required: true
    },
    user: {
      type: String,
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

module.exports.getDaysSharedByUser = (userId, callback) => {
  const query = { user: userId };
  SharedDay.find(query, callback);
};

module.exports.removeSharedDays = (deletedDays, callback) => {
  const query = { _id: { $in: deletedDays } };
  SharedDay.remove(query, callback);
};

module.exports.getAllSharedDays = callback => {
  SharedDay.find()
    .sort({ createdAt: -1 })
    .exec(callback);
};
