const mongoose = require('mongoose');
const FoodSchema = mongoose.model('Food').schema;

const EditedFoodSchema = mongoose.Schema(
  {
    editedBy: {
      type: String,
      required: true
    },
    originalFood: FoodSchema,
    editedFood: FoodSchema
  },
  { timestamps: true }
);

const EditedFood = (module.exports = mongoose.model('EditedFood', EditedFoodSchema));

module.exports.saveFoods = (foods, callback) => {
  EditedFood.insertMany(foods, callback);
};

module.exports.getAllFoods = callback => {
  EditedFood.find()
    .sort({ createdAt: -1 })
    .exec(callback);
};

module.exports.removeEditedFoods = (deletedFoods, callback) => {
  const query = { _id: { $in: deletedFoods } };
  EditedFood.remove(query, callback);
};
