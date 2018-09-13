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
  packageSize: {
    type: Number,
    required: true,
    default: 0
  },
  servingSize: {
    type: Number,
    required: true,
    default: 0
  },
  editing: {
    type: Boolean,
    required: false,
    default: false
  },
  username: {
    type: String,
    required: true
  }
});

const Food = (module.exports = mongoose.model('Food', FoodSchema));

module.exports.getFoods = callback => {
  Food.find(callback);
};

module.exports.getUserFoods = (user, callback) => {
  Food.find({ $or: [{ username: user }, { username: 'admin' }] }, callback);
};

module.exports.addFood = (newFood, callback) => {
  newFood.save(callback);
};

module.exports.removeFood = (foodId, callback) => {
  let query = { _id: foodId };
  Food.remove(query, callback);
};
