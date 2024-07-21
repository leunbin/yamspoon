const express = require('express');
const { userController } = require('../controller');
const { authMiddleware } = require('../middleware');

const userRouter = express.Router();

//@desc GET api/v1/user
userRouter.get(
  '/',
  authMiddleware.isAuthenticated,
  userController.getUserInfo
);

//@desc PUT api/v1/user
userRouter.put(
  '/',
  authMiddleware.isAuthenticated,
  userController.putUpdateUser
);

//@desc POST api/v1/user/findUserid
userRouter.post(
  '/findUserid',
  userController.postUserId
);

//@desc POST api/v1/user/findUserPassword
userRouter.post(
  '/findUserPassword',
  userController.postUserPassword
);

//@desc PUT api/v1/user/resetPassword/:userId
userRouter.put(
  '/resetPassword/:userId',
  userController.putResetPassword
);

//@desc DELETE api/v1/user
userRouter.delete(
  '/',
  authMiddleware.isAuthenticated,
  userController.deleteUserInfo
);

//@desc GET api/v1/user/fridge
userRouter.get(
  '/fridge',
  authMiddleware.isAuthenticated,
  userController.getUserFridge
);

//@desc GET api/v1/user/bookmark
userRouter.get(
  '/bookmark',
  authMiddleware.isAuthenticated,
  userController.getUserBookmark
)

//@desc PUT api/v1/user/fridge
userRouter.put(
  '/fridge',
  authMiddleware.isAuthenticated,
  userController.putUpdateUserIngredients
);

//@desc PUT api/v1/user/bookmark
userRouter.put(
  '/bookmark',
  authMiddleware.isAuthenticated,
  userController.putUpdateBookmark
);

userRouter.get(
  '/myRecipe',
  authMiddleware.isAuthenticated,
  userController.getOwnRecipe
)

module.exports = userRouter;