const { Recipe, Recipe_Category } = require("./Recipe");
const { Ingredient, Ingredient_Category } = require("./Ingredient");

module.exports = {
  User : require("./User"),
  Recipe : Recipe,
  Recipe_Category : Recipe_Category,
  Ingredient : Ingredient,
  Ingredient_Category : Ingredient_Category
};
