const mongoose = require("mongoose");
const { ingredientSchema } = require("../schema");
const { ingredientCategorySchema } = require("../schema");

const Ingredient = mongoose.model("ingredients", ingredientSchema);
const Ingredient_Category = mongoose.model("ingredient_Category", ingredientCategorySchema);

module.exports = { Ingredient, Ingredient_Category };