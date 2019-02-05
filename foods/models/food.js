const mongoose = require('mongoose');

const FoodSchema = mongoose.Schema(
  {
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
      required: true,
      default: 0
    },
    sokeri: {
      type: Number,
      required: true,
      default: 0
    },
    packageSize: {
      type: Number,
      required: false,
      default: 0
    },
    servingSize: {
      type: Number,
      required: false,
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
    },
    en: {
      type: String,
      required: false,
      default: ''
    },
    reasonForEditing: {
      type: String,
      required: false,
      default: ''
    },
    waitingForApproval: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  { timestamps: true }
);

const Food = (module.exports = mongoose.model('Food', FoodSchema));

module.exports.getFoods = callback => {
  Food.find()
    .sort({ createdAt: -1 })
    .exec(callback);
};

module.exports.getUserFoods = (user, callback) => {
  Food.find({ $or: [{ username: user }, { username: 'admin' }] }, callback);
};

module.exports.foodsByUser = (user, callback) => {
  Food.find({ username: user }, callback);
};

module.exports.addFood = (newFood, callback) => {
  newFood.save(callback);
};

module.exports.editFood = (food, callback) => {
  const query = { _id: food._id };
  Food.findByIdAndUpdate(query, food, { new: true }, callback);
};

module.exports.removeFoods = (deletedFoods, callback) => {
  const query = { _id: { $in: deletedFoods } };
  Food.remove(query, callback);
};

module.exports.getAmountOfFoods = callback => {
  Food.countDocuments(callback);
};

module.exports.updateWaitingForApproval = (ids, value, callback) => {
  console.log(ids);
  const query = { _id: { $in: ids } };
  const update = { $set: { waitingForApproval: value } };
  Food.updateMany(query, update, callback);
};
