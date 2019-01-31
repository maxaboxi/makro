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
