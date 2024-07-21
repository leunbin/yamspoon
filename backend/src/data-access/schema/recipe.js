const mongoose = require("mongoose");

const recipeCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const ingredientSchema = new mongoose.Schema({
  ingredientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true
  },
  name: {
    type: String,
    ref: 'Ingredient',
    required: true
  },
  amount: {
    type: String,
    required: false
  }
}, { _id: false });

const sauceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: false
  }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creatorNickName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  content: [{
    type: String,
    required: true
  }],
  ingredients: [ingredientSchema], 
  sauce: [sauceSchema],           
  like: {
    type: [String],
     default: []
  },
  img: {
    type: String,
    required: false
  },
  recipe_Category: {
    categoryId: {   
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe_Category',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
		default: () => Date.now() + 9 * 60 * 60 * 1000,
  },
}, {
  versionKey: false
});

module.exports = {
  recipeCategorySchema,
  recipeSchema
};