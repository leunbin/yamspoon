const { ingredientDAO } = require('../data-access');

class ingredientService {
  async getAllCategories() {
    return await ingredientDAO.findAllCategories();
  }

  async getIngredientsByCategoryId(categoryId) {
    // console.log(categoryName);
    const ingredients = await ingredientDAO.findIngredientsByCategoryId(categoryId);
    // console.log(ingredients);
    return ingredients;
  }
}

module.exports = new ingredientService();