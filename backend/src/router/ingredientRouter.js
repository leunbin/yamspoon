const express = require('express');
const { ingredientController } = require('../controller');

const ingredientRouter = express.Router();

//카테고리 전체 조회
ingredientRouter.get(
  '/categories', 
  ingredientController.listAllCategories);

//개별 카테고리 조회
ingredientRouter.get(
  '/categories/:categoryId', 
  ingredientController.listIngredientsByCategory
);



module.exports = ingredientRouter;