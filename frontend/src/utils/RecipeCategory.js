import { api } from './api';

export default {
  /**
   * @method GET
   * @summary 레시피 카테고리 조회
   */
  getRecipeCategory() {
    return api({
      url: '/recipes/categories',
      method: 'get',
    });
  },
};
