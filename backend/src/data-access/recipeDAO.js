const { Recipe } = require("./model");
const { Recipe_Category } = require("./model");

class RecipeDAO {
  // async create(data) {
  //   const recipe = new Recipe(data);
  //   await recipe.save();
  //   return recipe.toObject();
  // }

  /** 전체 레시피 조회 */
  async findAll() {
    return await Recipe.find({}).lean();
  }

  // 레시피 추가
  async create(newRecipeData) {
    const recipe = new Recipe(newRecipeData);
    await recipe.save();
    return recipe.toObject();
  }

  // 레시피 수정 DAO
  async update(recipeId, updateData) {
    return await Recipe.findByIdAndUpdate(recipeId, updateData, { new: true, runValidators: true });
  }

// 레시피 삭제 DAO
async delete(recipeId) {
  return await Recipe.findByIdAndDelete(recipeId);
}


  /** 레시피 아이디 개별 조회 */
  async findById(id) {
    return await Recipe.findById(id).lean();
  }

  /** 레시피 좋아요 수업데이트 */
  async updateById(recipeId, userId) {
    const options = { new: true };  // 업데이트된 문서를 반환받기 위한 옵션
    return await Recipe.findByIdAndUpdate(recipeId, userId, options).lean();
  }

    // 레시피 카테고리 전체 조회
  async findAllCategories() {
    return await Recipe_Category.find({}).lean();
  }

  /** 레시피 카테고리로 레시피 조회 */
  async findByCategory(categoryId) {
    return await Recipe.find({ recipe_Category: categoryId }).lean();
  }

  /** 좋아요 배열의 길이를 기준으로 정렬하여 가장 인기 있는 레시피를 조회 */
  async findPopular() {
    return await Recipe.aggregate([
      {
        $addFields: {
          likeCount: { $size: "$like" } // 'like' 배열의 길이를 'likeCount'라는 새 필드로 추가
        }
      },
      {
        $sort: { likeCount: -1 } // 'likeCount' 필드를 기준으로 내림차순 정렬
      },
      {
        $limit: 10 // 상위 10개 문서만 반환
      }
    ]);
  }
  

  /** 생성 날짜 기준으로 최신 레시피를 조회 */
  async findRecent() {
    return await Recipe.find().sort({ 'createdAt': -1 }).limit(10).lean();
  }

  /** 재료별 페이지 */
  async findByIngredientId(ingredientId) {
    const recipes = await Recipe.find({ "ingredients.ingredientId": ingredientId }).lean();
    return { recipes };
  }


  /** 레시피 타입별 페이지 */
  async findByCategoryId(categoryId) {
    const recipes = await Recipe.find({ "recipe_Category.categoryId": categoryId }).lean();
    return { recipes };
  }
  
  // /** 검색 결과 페이지 */
  // async searchRecipes(keyword, page, limit, sort = 'score') {
  //   const query =  [
  //     {$search : {
  //     index : 'title_index',
  //     text : { query : keyword, path : 'title' }
  //     }}
  //   ]
  //   let sortOptions = { score: { $meta: "textScore" } };  // 기본값은 텍스트 검색 점수 순

  //   if (sort === 'recent') {
  //       sortOptions = { createdAt: -1 };  // 최신순 정렬
  //   } else if (sort === 'popular') {
  //       sortOptions = { 'like.length': -1 };  // 추천순 정렬
  //   }

  //   const recipes = await Recipe.aggregate(query)
  //                               .sort(sortOptions)
  //                               .skip((page - 1) * limit)
  //                               .limit(limit)
  //   const total = await Recipe.countDocuments(query);

  //   return {
  //       recipes,
  //       totalPages: Math.ceil(total / limit),
  //       currentPage: page
  //   };
  // }
}

module.exports = new RecipeDAO();
