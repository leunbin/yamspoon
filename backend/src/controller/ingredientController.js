const { ingredientService } = require('../service');
const utils = require('../misc/utils');

const ingredientController = {
  
  
  async listAllCategories(req, res, next) {
    try {
      const categories = await ingredientService.getAllCategories();
      res.status(200).json(utils.buildResponse(categories));
    } catch (err) {
      next(err);
    }
  },

  async listIngredientsByCategory(req, res, next) {
    // const categoryName  = req.params.categoryName;
    // // console.log(categoryName);
    // const ingredients = await ingredientService.getIngredientsByCategoryName(categoryName);
    // console.log(ingredients)
    // try {
    //   if (!ingredients) {
    //     res.status(404).json(utils.buildResponse(null, "Category not found"));
    //   } else {
    //     res.json(utils.buildResponse(ingredients));
    //   }
    // }catch (err) {
    //   next(err);
    // }
    try {
      const { categoryId } = req.params;
      const ingredients = await ingredientService.getIngredientsByCategoryId(categoryId);
      res.json(utils.buildResponse(ingredients));
    } catch (err) {
      next(err);
    }
  }

};

module.exports = ingredientController;