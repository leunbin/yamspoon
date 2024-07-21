const jsonwebtoken = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../data-access/model');

const isAuthenticated = (req, res, next) => {
  if (req.headers["authorization"] === undefined) {
    return res.status(401).json({
      error: "권한이 없거나 인증되지 않은 유저입니다.",
      data: null,
    });
  }

  const token = req.headers["authorization"].slice(7);
  const userInfo = jsonwebtoken.verify(token, config.jwtSecret);
  // console.log(userInfo.id); // 수정된 부분

  User.findById(userInfo.id)
    .then(user => {
      if (!user) {
        return res.status(401).json({
          error: "사용자를 찾을 수 없습니다.",
          data: null,
        });
      }

      res.locals.user = {
        id: user.id,
        userId: user.userId,
        email: user.email,
        nickname: user.nickname, 
        isAdmin: user.isAdmin,
        recipe: user.recipe,
        ingredients: user.ingredients,
      };

      next();
    })
    .catch(error => {
      return res.status(500).json({
        error: "사용자 조회 중 오류가 발생했습니다.",
        data: null,
      });
    });
};

module.exports = {
  isAuthenticated,
};
