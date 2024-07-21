const { recipeDAO } = require('../data-access');
const { uploadMiddleware } = require('../middleware');

class RecipeService {
  // 전체 레시피 조회
  async getAllRecipes() {
    return await recipeDAO.findAll();
  }

  // 레시피 추가
  async createRecipe(id, nickname, title, description, content, ingredients, sauce, recipe_Category, img,) {
    //recipeData.creatorId = id;
    const newRecipeData = {
      creatorId: id,
      creatorNickName : nickname,
      title: title,
      description: description,
      content: content,
      ingredients: ingredients,
      sauce: sauce,
      recipe_Category: recipe_Category,
      img: img,
    };
    const createRecipe = await recipeDAO.create(newRecipeData);
    return createRecipe
  }

// 레시피 수정
async updateRecipe(recipeId, updateData) {
  try {
    const recipe = await recipeDAO.findById(recipeId);
    if (!recipe) {
      throw new Error('Recipe not found');
    }

    if (updateData.img && recipe.img && recipe.img !== updateData.img) {
      const oldImageKey = recipe.img.split('/').pop();
      await uploadMiddleware.deleteS3File(oldImageKey);
    }

    const updatedRecipe = await recipeDAO.update(recipeId, updateData);
    return updatedRecipe;
  } catch (error) {
    console.error(`Failed to update recipe: ${error.message}`);
    throw new Error(`Failed to update recipe: ${error.message}`);
  }
}


// 레시피 삭제 서비스
async deleteRecipe(recipeId) {
  try {
      const recipe = await recipeDAO.findById(recipeId);
      if (!recipe) {
          throw new Error('Recipe not found');
      }

      // S3에서 레시피 관련 이미지 파일 삭제
      if (recipe.img) {
          const imageKey = recipe.img.split('/').pop();
          await uploadMiddleware.deleteS3File(imageKey);
      }

      await recipeDAO.delete(recipeId);  // DB에서 레시피 삭제
  } catch (error) {
      console.error(`Failed to delete recipe: ${error.message}`);
      throw new Error(`Failed to delete recipe: ${error.message}`);
  }
}


  // // 재료 ID로 레시피 조회
  // async getRecipesByIngredientId(ingredientId) {
  //   return await recipeDAO.findByIngredientId(ingredientId);
  // }

  // // 카테고리 ID로 레시피 조회
  // async getRecipesByCategoryId(categoryId) {
  //   return await recipeDAO.findByCategoryId(categoryId);
  // }

  // 레시피 ID로 단일 레시피 조회
  async getRecipeById(recipeId) {
    return await recipeDAO.findById(recipeId);
  }

  // 레시피 좋아요 수 업데이트
  // async updateRecipeLikes(recipeId, userId) {
  //   const recipe = await this.getRecipeById(recipeId);
  //   const updatedLikes = recipe.like.includes(userId) ? recipe.like.filter(id => id !== userId) : [...recipe.like, userId];
  //   return await recipeDAO.updateById(recipeId, { like: updatedLikes });
  // }
  async updateRecipeLikes(recipeId, userId) {
    const recipe = await this.getRecipeById(recipeId);
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    const updatedLikes = recipe.like.includes(userId) ?
      recipe.like.filter(id => id !== userId) : // 문자열 직접 비교
      [...recipe.like, userId];  // 직접 추가
    return await recipeDAO.updateById(recipeId, { like: updatedLikes });
  }
  
  
  // 인기 레시피 조회
  async getPopularRecipes() {
    return await recipeDAO.findPopular();
  }

  // 최신 레시피 조회
  async getRecentRecipes() {
    return await recipeDAO.findRecent();
  }

  //레시피 카테고리 조회
  async listAllCategories() {
    return await recipeDAO.findAllCategories();
  }

  //재료별 레시피 개별 조회
  async getRecipesByIngredientId(ingredientId) {
    return await recipeDAO.findByIngredientId(ingredientId);
  }

  //레시피 타입별 개별 조회
  async getRecipesByCategoryId(categoryId) {
    return await recipeDAO.findByCategoryId(categoryId);
  }
  
  // // 레시피 검색 결과
  // async searchRecipes(keyword, sort = 'score') {
  //   return await recipeDAO.searchRecipesPaginated(keyword, sort);
  // }
    
}

module.exports = new RecipeService();
