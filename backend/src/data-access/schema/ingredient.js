const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  category : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ingredient_category',
    require: true
  },
  name: { 
    type: String, 
    required: true 
  }
});

const ingredientCategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  },
  ingredients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient' 
  }]
});

module.exports = { 
  ingredientSchema, 
  ingredientCategorySchema 
};
