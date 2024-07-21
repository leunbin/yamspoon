const express = require('express');
const { authController } = require('../controller');
const { mailController } = require('../controller');
const { mailMiddleware } = require('../middleware');

const authRouter = express.Router();

//@desc  POST /api/v1/auth/signUp
authRouter.post(
  "/signUp",
  authController.postSignUp
);

//@desc POST /api/v1/auth/verifyId
authRouter.post(
  '/verifyId',
  authController.postVerifyId
);

//@desc POST /api/v1/auth/verifyNickname
authRouter.post(
  '/verifyNickname',
  authController.postVerifyNickname
);

//@desc POST /api/v1/auth/login
authRouter.post(
  '/login',
  authController.postLogin
);

//@desc POST /api/v1/auth/send-verification-email
authRouter.post(
'/send-verification-email',
mailController.sendEmail
);

//@desc POST /api/v1/auth/verify
authRouter.post (
  '/verify',
  mailMiddleware.isVerified,
  mailController.verifyEmail
)
module.exports = authRouter;