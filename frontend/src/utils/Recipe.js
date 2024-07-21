import { api } from './api';

export default {
  /**
   * @method GET
   * @summary 레시피 전체 조회
   */
  getRecipe() {
    return api({
      url: '/recipes',
      method: 'get',
    });
  },

  /**
   * @method GET
   * @summary 재료별 레시피 조회
   * @param ingredientId 재료 아이디
   */
  getIngredientRecipe(ingredientId) {
    return api({
      url: `/recipes/ingredients/${ingredientId}`,
      method: 'get',
    });
  },

  /**
   * @method GET
   * @summary 타입별 레시피 조회
   * @param categoryId 타입(카테고리) 아이디
   */
  getCatgory(categoryId) {
    return api({
      url: `/recipes/categories/${categoryId}`,
      method: 'get',
    });
  },

  /**
   * @method GET
   * @summary 레시피 상세 조회
   * @param id 레시피 아이디
   */
  getDetailRecipe(id) {
    return api({
      url: `/recipes/${id}`,
      method: 'get',
    });
  },

  /**
   * @method put
   * @summary 레시피 좋아요
   * @param id 레시피 아이디
   */
  putLikeRecipe(id, recipeData) {
    return api({
      url: `/recipes/like/${id}`,
      method: 'put',
      data: recipeData
    });
  },

  /**
   * @method GET
   * @summary 화제의 레시피 10개 조회
   */
  getRecipePopular() {
    return api({
      url: '/recipes/popular',
      method: 'get',
    });
  },

  /**
   * @method GET
   * @summary 최근 올라온 레시피 조회
   */
  getRecipeRecent() {
    return api({
      url: '/recipes/recent',
      method: 'get',
    });
  },

  /**
   * @method POST
   * @summary 레시피 등록
   * @param recipeData 레시피 정보
   */
  postRecipe(recipeData) {
    return api({
      url: '/recipes',
      method: 'post',
      data: recipeData
    });
  },
  
  /**
   * @method PUT
   * @summary 레시피 수정
   * @param id 레시피 아이디
   * @param recipeData 레시피 정보
   */
  updateRecipe(id, recipeData) {
    return api({
      url: `/recipes/${id}`,
      method: 'put',
      data: recipeData
    });
  },

  /**
   * @method DELETE
   * @summary 레시피 삭제
   * @param id 레시피 아이디
   */
    deleteRecipe(id) {
    return api({
      url: `/recipes/${id}`,
      method: 'delete'
    });
  },

};