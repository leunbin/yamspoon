const mongoose = require("mongoose");
const { recipeSchema } = require("../schema");
const { recipeCategorySchema } = require("../schema");

// Recipe 모델 클래스와 Recipe_Category 모델 클래스 생성
const Recipe = mongoose.model("Recipe", recipeSchema);
const Recipe_Category = mongoose.model("Recipe_Category", recipeCategorySchema);

module.exports = { Recipe, Recipe_Category };