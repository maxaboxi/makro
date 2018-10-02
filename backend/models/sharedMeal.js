const mongoose = require('mongoose');

const SharedMealSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    info: {
      type: String,
      required: false
    },
    foods: {
      type: Array,
      required: true
    }
  },
  { timestamps: true }
);

const sharedMeal = (module.exports = mongoose.model(
  'sharedMeal',
  SharedMealSchema
));

module.exports.saveMeal = (meal, callback) => {
  meal.save(callback);
};

module.exports.saveEditedMeal = (meal, callback) => {
  const query = { _id: meal._id };
  sharedMeal.findByIdAndUpdate(query, meal, { new: true }, callback);
};

module.exports.getMealsByUser = (username, callback) => {
  const query = { username: username };
  sharedMeal.find(query, callback);
};

module.exports.getAllMeals = callback => {
  sharedMeal
    .find()
    .sort({ createdAt: -1 })
    .exec(callback);
};

module.exports.removeMeals = (deletedMeals, callback) => {
  const query = { _id: { $in: deletedMeals } };
  sharedMeal.remove(query, callback);
};
