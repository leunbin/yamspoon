const { recipeService } = require('../service');
const utils = require('../misc/utils');

const recipeController = {
  // 전체 레시피 조회
  async listAllRecipes(req, res, next) {
    try {
      const recipes = await recipeService.getAllRecipes();
      res.json(utils.buildResponse(recipes));
    } catch (err) {
      next(err);
    }
  },

// 레시피 추가
  async createRecipe(req, res, next) {
    try {
      if (!res.locals.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { id , nickname } = res.locals.user;
      let img = req.file ? req.file.location : '';
      const { title, description, content, ingredients, sauce, recipe_Category } = req.body;

      const recipe = await recipeService.createRecipe(
        id,
        nickname,
        title,
        description,
        content,
        ingredients,
        sauce,
        recipe_Category,
        img,
      );
      res.status(200).json(utils.buildResponse(recipe));
    } catch (err) {
      next(err);
    }
  },

  // 레시피 수정
  async updateRecipe(req, res, next) {
    const { id, nickname } = res.locals.user;
    let img = req.file ? req.file.location : undefined;
    const { title, description, content, ingredients, sauce, recipe_Category } = req.body;
    const { id: recipeId } = req.params; // URL 파라미터에서 레시피 ID 추출

    try {
      const recipeInfo = await recipeService.getRecipeById(recipeId); // 데이터베이스에서 레시피 조회

      if (!recipeInfo) {
        return res.status(404).json(utils.buildResponse(null, "Recipe not found")); // 레시피가 없는 경우 오류 반환
      }

      if (recipeInfo.creatorId.toString() !== id) {
        return res.status(403).json(utils.buildResponse(null, "You are not authorized to update this recipe")); // 작성자가 아닐 경우 권한 오류 반환
      }

      // 이미지가 업로드되지 않았다면 기존 이미지 유지
      if (!img && recipeInfo.img) {
        img = recipeInfo.img;
      }

      const updateData = {
        title,
        description,
        content,
        ingredients,
        sauce,
        recipe_Category,
        img,
        nickname
      };

      const sanitizedUpdateData = utils.sanitizeObject(updateData); // undefined 항목 제거
      const updatedRecipe = await recipeService.updateRecipe(recipeId, sanitizedUpdateData); // 업데이트 로직 호출
      res.status(200).json(utils.buildResponse(updatedRecipe));
    } catch (err) {
      next(err); // 에러 처리
    }
  },

// 레시피 삭제 컨트롤러
async deleteRecipe(req, res, next) {
  const { id } = res.locals.user;  // 로그인한 사용자 ID
  const recipeId = req.params.id;  // URL에서 레시피 ID 추출

  try {
      const recipeInfo = await recipeService.getRecipeById(recipeId);  // 레시피 정보 조회

      if (!recipeInfo) {
          return res.status(404).json(utils.buildResponse(null, "Recipe not found"));
      }

      if (recipeInfo.creatorId.toString() !== id) {
          return res.status(403).json(utils.buildResponse(null, "You are not authorized to delete this recipe"));
      }

      await recipeService.deleteRecipe(recipeId);  // 레시피 삭제
      res.status(200).json(utils.buildResponse(null, "Recipe deleted successfully"));
  } catch (err) {
      next(err);
    }
  },

  // 인기 레시피 조회
  async listPopularRecipes(req, res, next) {
    try {
      const popularRecipes = await recipeService.getPopularRecipes();
      res.json(utils.buildResponse(popularRecipes));
    } catch (err) {
      next(err);
    }
  },

  // 최신 레시피 조회
  async listRecentRecipes(req, res, next) {
    try {
      const recentRecipes = await recipeService.getRecentRecipes();
      res.json(utils.buildResponse(recentRecipes));
    } catch (err) {
      next(err);
    }
  },

  // 재료 ID로 레시피 조회
  async listRecipesByIngredient(req, res, next) {
    try {
      const { ingredientId } = req.params;
      const recipes = await recipeService.getRecipesByIngredientId(ingredientId);
      res.json(utils.buildResponse(recipes));
    } catch (err) {
      next(err);
    }
  },

  // 레시피 카테고리 전체 조회
  async listAllCategories(req, res) {
    try {
      const categories = await recipeService.listAllCategories();
      res.json(utils.buildResponse(categories));
    } catch (err) {
      next(err);
    }
  },
  
  // 카테고리 ID로 레시피 조회
  async listRecipesByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const recipes = await recipeService.getRecipesByCategoryId(categoryId);
      res.json(utils.buildResponse(recipes));
    } catch (err) {
      next(err);
    }
  },

  // 레시피 ID로 단일 레시피 조회
  async getRecipe(req, res, next) {
    try {
      const { id } = req.params;
      const recipe = await recipeService.getRecipeById(id);
      res.json(utils.buildResponse(recipe));
    } catch (err) {
        next(err);
    }
  },

  // 레시피 좋아요 수 업데이트
  async updateRecipeLikes(req, res, next) {
    try {
      const { id: recipeId } = req.params;
      const { userId } = res.locals.user; // 사용자 ID는 요청 본문에서 가져옴
      const updatedRecipe = await recipeService.updateRecipeLikes(recipeId, userId);
      if (!updatedRecipe) {
        return res.status(404).json(utils.buildResponse(null, "Recipe not found"));
      }
      res.json(utils.buildResponse(updatedRecipe));
    } catch (err) {
      next(err);
    }
  },

  // // 레시피 검색
  // async searchRecipes(req, res, next) {
  //   try {
  //     const { keyword, sort } = req.query;
  //     const page = parseInt(req.query.page) || 1;
  //     const limit = parseInt(req.query.limit) || 15;
  //     const result = await recipeService.searchRecipesPaginated(keyword, page, limit, sort);
  //     res.json(utils.buildResponse(result));
  //   } catch (err) {
  //     next(err);
  //   }
  // }
};

module.exports = recipeController;
