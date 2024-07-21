const { userService } = require('../service');
const utils = require('../misc/utils');
const { userDAO } = require('../data-access')

const userController = {
  //@desc get userInfo
  //@route GET /user/
  async getUserInfo (req,res,next) {
    try {
      const { id } = res.locals.user;
      const userInfo = await userService.getUserInfo(id);
      res.status(200).json(utils.buildResponse(userInfo));
    } catch (error) {
      next(error);
    }
  },

  //@desc update userInfo
  //@route PUT / user/
  async putUpdateUser (req,res,next) {
    try {
      const { id } = res.locals.user;
      const updateInfo = req.body;
      const updateUser = await userService.updateUser(id, updateInfo);
      res.status(200).json(utils.buildResponse(updateUser));
    } catch (error) {
      next(error);
    }
  },

  //@desc find userId
  //@route POST /findUserid
  async postUserId (req,res,next) {
    try {
      const { name, email } = req.body;
      const userId = await userService.findUserIdByNameAndEmail(name, email);
      res.status(200).json(utils.buildResponse(userId));
    } catch (error) {
      next(error);
    }
  },

  //@desc find userPassword
  //@route POST /findUserPassword
  async postUserPassword (req,res,next) {
    try {
      const { userId, email } = req.body;
      const user = await userService.findUserPasswordByIdAndEmail(userId, email);
      res.status(200).json(utils.buildResponse(user));
    } catch (error) {
      next(error);
    }
  },

  //@desc reset user password
  //@route PUT /resetPassword/{id}
  async putResetPassword (req,res,next) {
    try {
      const userId = req.params.userId;
      const newPassword = req.body.newPassword;
      const updateUser = await userService.resetPassword(userId, newPassword);
      res.status(200).json(utils.buildResponse(updateUser));
    } catch (error) {
      next(error);
    }
  },

  //@desc delete userInfo
  //@route DELETE /user/
  async deleteUserInfo (req,res,next) {
    try {
      const { id } = res.locals.user; 
      const deleteUser = await userService.deleteUserInfo(id);
      res.status(200).json ({
        message: '사용자가 성공적으로 삭제되었습니다.',
        user: deleteUser,
      });
    } catch (error) {
      next (error);
    }
  },

  //@desc get user fridge
  //@route GET /user/fridge
  async getUserFridge (req,res,next) {
    try {
      const { id } = res.locals.user; 
      console.log(id);
      const fridgeRecipe = await userService.getUserFridge(id);
      res.status(200).json(utils.buildResponse(fridgeRecipe));
    } catch (error) {
      next(error);
    }
  },

    //@desc get user bookmark
  //@route GET /user/bookmark
  async getUserBookmark (req,res,next) {
    try {
      const { id } = res.locals.user; 
      console.log(id);
      const bookmarkRecipe = await userService.getUserBookmark(id);
      res.status(200).json(utils.buildResponse(bookmarkRecipe));
    } catch (error) {
      next(error);
    }
  },

  //@desc update user ingredients
  //@route PUT /user/fridge
  async putUpdateUserIngredients (req,res,next) {
    try {
      const { id } = res.locals.user; 
      const { ingredients } = req.body;
      const updateIngredients = await userService.updateUserIngredients(id, ingredients);
      res.status(200).json(utils.buildResponse(updateIngredients));
    } catch (error) {
      next(error);
    }
  },

  //@desc update user bookmark
  //@route PUT /user/bookmark
  async putUpdateBookmark (req,res,next) {
    try {
      const { id } = res.locals.user; 
      const { recipe } = req.body;
      const updateBookmark = await userService.updateBookmark(id,recipe);
      res.status(200).json(utils.buildResponse(updateBookmark));
    } catch (error) {
      next(error);
    }
  },

  //@desc get own's recipe
  //@route GET /user/myRecipe
  async getOwnRecipe (req,res,next) {
    try {
      const { id } = res.locals.user;
      // console.log(id);
      const recipe = await userDAO.findOwnRecipe(id);
      console.log(recipe.length);
      res.status(200).json(utils.buildResponse({ recipe, userOid: id }));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;