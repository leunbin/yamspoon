const { authService } = require('../service');
const utils = require('../misc/utils');
const AppError = require('../misc/AppError');
const commonErrors = require('../misc/commonErrors');

const authController = {
  //@desc Create user
  //@route POST / signUp
  async postSignUp (req, res, next) {
    try {
      const { userId, name, email, password, nickname, isAdmin } = req.body;

      const newUser = await authService.signUp( { userId, name, email, password, nickname, isAdmin } );

      res.status(201).json(utils.buildResponse(newUser));
    } catch (error) {
      next(error);
    }
  },

  //@desc verify Id
  //@route POST /veriftId
  async postVerifyId (req, res, next) {
    try {
      const userId = req.body.userId;

      const result = await authService.verifyId(userId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  //@desc verify nickname
  //@route POST /verifyNickname
  async postVerifyNickname (req,res,next) {
    try {
      const nickname = req.body.nickname;
      const result = await authService.verifyNickname(nickname);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  //@desc login
  //@route POST /login
  async postLogin (req,res,next) {
    try {
      const { userId, password } = req.body;
      const token = await authService.login ({
        userId,
        plainPassword : password,
      });
      res.status(201).json(utils.buildResponse(token));
    } catch (error) {
      next(error);
    }
  },

}

module.exports = authController;