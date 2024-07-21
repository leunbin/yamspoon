const { recipeCategorySchema, recipeSchema } = require("./recipe");
const { ingredientCategorySchema, ingredientSchema } = require("./ingredient");
const userSchema = require('./user')

module.exports = {
  ingredientSchema,
  ingredientCategorySchema,
  recipeCategorySchema,
  recipeSchema,
  userSchema
};
