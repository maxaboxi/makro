const mongoose = require('mongoose');

const FoodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  energia: {
    type: Number,
    required: true
  },
  hh: {
    type: Number,
    required: true
  },
  rasva: {
    type: Number,
    required: true
  },
  proteiini: {
    type: Number,
    required: true
  },
  kuitu: {
    type: Number,
    required: true
  },
  sokeri: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true
  }
});

const Food = (module.exports = mongoose.model('Food', FoodSchema));

module.exports.getFoods = function(callback) {
  Food.find(callback);
};

module.exports.addFood = function(newFood, callback) {
  newFood.save(callback);
};

module.exports.removeFood = function(foodId, callback) {
  let query = { _id: foodId };
  Food.remove(query, callback);
};
